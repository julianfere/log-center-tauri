#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Deserialize;
use tauri::{State, Window};
extern crate notify;

mod file_helpers;
use file_helpers::get_last_change;

use notify::{watcher, DebouncedEvent, RecursiveMode, Watcher};
use std::sync::{mpsc::channel, Arc, Mutex};
use std::{
    collections::{HashMap, LinkedList},
    time::Duration,
};

use humthreads::{registered_threads, Builder, Thread, ThreadScope};

struct AppState {
    threads: HashMap<String, Thread<()>>,
    files: LinkedList<String>,
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
                let paylaod = match get_last_change(&path) {
                    Ok(paylaod) => paylaod,
                    Err(err) => String::from(err.to_string()),
                };

                let formated_string = format!("log-updated:{}", id);

                match window.emit(&formated_string, &paylaod) {
                    Ok(_) => {
                        println!("Emitted: {} with: {}", formated_string, paylaod);
                    }
                    Err(err) => {
                        eprintln!("Error: {:?}", err);
                    }
                }
            }
            Ok(_) => {}
            Err(std::sync::mpsc::TryRecvError::Empty) => {}
            Err(err) => {
                window.emit("error-occurred", "").unwrap();
                eprintln!("Error: {:?}", err);
            }
        }
    }
}

#[tauri::command]
fn subscribe(window: Window, files: Vec<FilePayload>, app_state: State<Arc<Mutex<AppState>>>) {
    println!("Subscribe called");
    for file in files {
        // im sure that this could be better, but it works for now and i dont know how to do it better
        let cloned_window = window.clone();
        let registered = registered_threads();
        let file_path = file.path.clone();
        let cloned_id = file.id.clone();
        let path_id = file.id.clone();

        let is_registered = registered.iter().any(|x| x.name == path_id);

        if is_registered {
            return;
        };

        match Builder::new(path_id).spawn(move |scope| {
            watch_file(cloned_window, &file_path, &cloned_id, scope);
        }) {
            Ok(trhead) => {
                app_state.lock().unwrap().threads.insert(file.id, trhead);
                app_state.lock().unwrap().files.push_back(file.path);
            }
            Err(err) => {
                window.emit("error-occurred", "").unwrap();
                eprintln!("Error: {:?}", err);
            }
        }
    }
}

#[tauri::command]
fn unsubscribe(thread_name: String, app_state: State<Arc<Mutex<AppState>>>) {
    let to_remove = app_state.lock().unwrap().threads.remove(&thread_name);
    if let Some(thread) = to_remove {
        thread.request_shutdown();
    }
}

fn main() {
    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(AppState {
            files: LinkedList::new(),
            threads: HashMap::new(),
        })))
        .invoke_handler(tauri::generate_handler![subscribe, unsubscribe])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
