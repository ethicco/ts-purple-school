import { FfmpegExecutor } from "./command-executor/commands/ffmpeg/ffmpeg.executor";
import { PromptService } from "./command-executor/core/prompt/prompt.service";
import { ConsoleLogger } from "./command-executor/out/console-logger/console-logger";

export class App {
  async run() {
    new FfmpegExecutor(ConsoleLogger.getInstance()).execute();
  }
}

const app = new App();
app.run();
