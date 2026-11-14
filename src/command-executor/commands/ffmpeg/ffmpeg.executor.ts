import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { CommandExecutor } from "../../core/executor/command.executor";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface";
import { ICommandExecFfmpeg, IFfmpegInput } from "./ffmpeg.types";
import { FileService } from "../../core/file/file.service";
import { PromptService } from "../../core/prompt/prompt.service";
import { FfmpegBuilder } from "./ffmpeg.builder";
import { StreamHandler } from "../../core/handlers/stream.handler";

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {
  private fileService: FileService = new FileService();
  private promptService: PromptService = new PromptService();

  constructor(logger: IStreamLogger) {
    super(logger);
  }

  protected async prompt(): Promise<IFfmpegInput> {
    const width = await this.promptService.input<number>("Ширина", "number");
    const height = await this.promptService.input<number>("Высота", "number");
    const path = await this.promptService.input<string>(
      "Путь до файла",
      "input",
    );
    const name = await this.promptService.input<string>("Имя", "input");

    return { width, height, path, name };
  }

  protected build(input: IFfmpegInput): ICommandExecFfmpeg {
    const output = this.fileService.getFilePath(input.path, input.name, "mp4");
    const args = new FfmpegBuilder()
      .input(input.path)
      .setVideoSize(input.width, input.height)
      .output(output);

    return { command: "ffmpeg", args, output };
  }

  protected spawn(command: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
    this.fileService.deleteFileExists(command.output);

    return spawn(command.command, command.args);
  }

  protected processStream(
    stream: ChildProcessWithoutNullStreams,
    logger: IStreamLogger,
  ): void {
    const handler = new StreamHandler(logger);
    handler.processOutput(stream);
  }
}
