#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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

fn watch_file(window: Window, path: &str, scope: ThreadScope) {
    println!("Watching {}", path);
    let (tx, rx) = channel();
    let mut watcher = watcher(tx.clone(), Duration::from_secs(1)).unwrap();
    watcher.watch(&path, RecursiveMode::NonRecursive).unwrap();

    while !scope.should_shutdown() {
        match rx.recv() {
            Ok(DebouncedEvent::Write(_)) => {
                let paylaod = get_last_change(&path).unwrap();
                window.emit("log-updated", paylaod).unwrap();
            }
            Ok(_) => {}
            Err(err) => {
                window.emit("error-occurred", "").unwrap();
                eprintln!("Error: {:?}", err);
            }
        }
    }
}

#[tauri::command]
fn subscribe(window: Window, thread_name: String, app_state: State<Arc<Mutex<AppState>>>) {
    let path = r"C:\Users\Julian\Desktop\test.txt";

    let registered = registered_threads();

    let is_registered = registered.iter().any(|x| x.name == thread_name.clone());

    if is_registered {
        return;
    };

    let handle = Builder::new(thread_name.clone()).spawn(move |scope| {
        watch_file(window, &path, scope);
    });

    app_state
        .lock()
        .unwrap()
        .threads
        .insert(thread_name.clone(), handle.unwrap());
    app_state.lock().unwrap().files.push_back(path.to_string());
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
