import execa from 'execa';

export interface IRunCommandOptions {
  command: string;
  arguments: Array<string>;
  options: execa.Options;
}
