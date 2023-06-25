#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{State, Window};
extern crate notify;

use notify::{watcher, DebouncedEvent, RecursiveMode, Watcher};
use std::collections::{HashMap, LinkedList};
use std::fs::{self, File};
use std::io::{Read, Seek, SeekFrom};
use std::sync::mpsc::channel;
use std::sync::{Arc, Mutex};
use std::thread::{spawn, JoinHandle};
use std::time::Duration;

struct AppState {
    trheads: HashMap<String, JoinHandle<()>>,
    files: LinkedList<String>,
}

#[tauri::command]
fn subscribe(window: Window, thread_name: String, thread_holder: State<Arc<Mutex<AppState>>>) {
    let path = r"C:\Users\Julian\Desktop\test.txt";

    let handler = spawn(move || {
        println!("Watching {}", path);
        let (tx, rx) = channel();
        let mut watcher = watcher(tx, Duration::from_secs(1)).unwrap();
        watcher.watch(&path, RecursiveMode::NonRecursive).unwrap();

        let mut contents = fs::read_to_string(&path).unwrap();
        let mut pos = contents.len() as u64;

        loop {
            match rx.recv() {
                Ok(DebouncedEvent::Write(_)) => {
                    let mut f = File::open(&path).unwrap();
                    f.seek(SeekFrom::Start(pos)).unwrap();

                    pos = f.metadata().unwrap().len();

                    contents.clear();
                    f.read_to_string(&mut contents).unwrap();

                    print!("{}", contents);
                    window.emit("log-updated", contents.clone()).unwrap();
                }
                Ok(_) => {}
                Err(err) => {
                    window.emit("error-occurred", "").unwrap();
                    eprintln!("Error: {:?}", err);
                }
            }
        }
    });

    thread_holder
        .lock()
        .unwrap()
        .trheads
        .insert(thread_name, handler);
}

fn main() {
    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(AppState {
            trheads: HashMap::new(),
            files: LinkedList::new(),
        })))
        .invoke_handler(tauri::generate_handler![subscribe])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
