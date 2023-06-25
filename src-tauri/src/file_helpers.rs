use easy_reader::EasyReader;
use std::fs::File;

pub fn get_last_change(path: &str) -> Result<String, std::io::Error> {
    let f = File::open(path)?;
    let mut reader = EasyReader::new(f)?;
    reader.eof();
    let content = reader.prev_line().unwrap();
    Ok(content.unwrap())
}
