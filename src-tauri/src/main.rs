#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Deserialize;
use std::{
    collections::{HashMap, HashSet},
    sync::{mpsc::channel, Arc, Mutex},
    time::Duration,
};
use tauri::{State, Window};
extern crate notify;
use humthreads::{registered_threads, Builder, Thread, ThreadScope};
use notify::{watcher, DebouncedEvent, RecursiveMode, Watcher};

mod file_helpers;
use file_helpers::get_last_change;

struct AppState {
    threads: HashMap<String, Thread<()>>,
    files: HashSet<String>,
}

#[derive(Deserialize, Clone)]
struct FilePayload {
    path: String,
    id: String,
}

fn watch_file(window: Window, path: &str, id: &str, scope: ThreadScope) {
    let (tx, rx) = channel();
    let mut watcher = watcher(tx.clone(), Duration::from_secs(1)).unwrap();

    watcher.watch(path, RecursiveMode::NonRecursive).unwrap();

    println!("Watching: {}", path);

    while !scope.should_shutdown() {
        match rx.try_recv() {
            Ok(DebouncedEvent::Write(_)) => {
                if let Ok(payload) = get_last_change(&path) {
                    let formatted_string = format!("log-updated:{}", id);
                    if let Err(err) = window.emit(&formatted_string, &payload) {
                        eprintln!("Error: {:?}", err);
                    } else {
                        println!("Emitted: {} with: {}", formatted_string, payload);
                    }
                } else {
                    eprintln!("Error while getting last change for {}", path);
                }
            }
            Ok(_) | Err(std::sync::mpsc::TryRecvError::Empty) => {}
            Err(err) => {
                window.emit("error-occurred", "").unwrap_or_default();
                eprintln!("Error: {:?}", err);
            }
        }
    }
}

#[tauri::command]
fn subscribe(window: Window, files: Vec<FilePayload>, app_state: State<Arc<Mutex<AppState>>>) {
    for file in files {
        let file_path = file.path.clone();
        let cloned_id = file.id.clone();
        let path_id = file.id.clone();

        if app_state.lock().unwrap().files.contains(&file_path) {
            continue;
        }

        let cloned_window = window.clone();
        let is_registered = registered_threads().iter().any(|x| x.name == path_id);
        if is_registered {
            continue;
        }

        match Builder::new(path_id).spawn(move |scope| {
            watch_file(cloned_window, &file_path, &cloned_id, scope);
        }) {
            Ok(thread) => {
                app_state
                    .lock()
                    .unwrap()
                    .threads
                    .insert(file.id.clone(), thread);
                app_state.lock().unwrap().files.insert(file.path);
            }
            Err(err) => {
                window.emit("error-occurred", "").unwrap_or_default();
                eprintln!("Error: {:?}", err);
            }
        }
    }
}

#[tauri::command]
fn unsubscribe(thread_name: String, app_state: State<Arc<Mutex<AppState>>>) {
    if let Some(mut state) = app_state.lock().ok() {
        if let Some(thread) = state.threads.remove(&thread_name) {
            thread.request_shutdown();
            println!("Unsubscribed: {}", thread_name);
        }
    }
}

fn main() {
    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(AppState {
            files: HashSet::new(),
            threads: HashMap::new(),
        })))
        .invoke_handler(tauri::generate_handler![subscribe, unsubscribe])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
