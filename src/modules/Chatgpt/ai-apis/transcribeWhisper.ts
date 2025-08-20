import fs from "fs";
import { exec } from "child_process";
import path from "path";

export const transcribeWhisper = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(filePath);
    const baseName = path.parse(filePath).name; // <- base of UUID filename
    const transcriptPath = path.join(outputDir, `${baseName}.txt`);

    const command = `whisper "${filePath}" --model tiny --language en --output_format txt --output_dir "${outputDir}"`;

    exec(command, (error, _stdout, stderr) => {
      if (error) return reject(stderr);

      try {
        const transcript = fs.readFileSync(transcriptPath, "utf-8");
        resolve(transcript);
      } catch (readErr) {
        reject(readErr);
      }
    });
  });
};
