import dotenv from 'dotenv';
import Joi from 'joi';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

export interface EnvConfig {
  [key: string]: string;
}

export interface IProteinObject {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;
  private readonly TXTFilesPath: string = path.resolve('./txt'); // txt文件储存的文件夹 针对于路径
  private proteinObject: IProteinObject;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
    this.proteinObject = {};
    this.initProteinObject(this.TXTFilesPath);
  }

  /**
   * 确保设置所有需要的变量，并返回经过验证的JavaScript对象
   * 包括应用的默认值。
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['dev', 'prod', 'test'])
        .default('dev'),
      SERVER_PORT: Joi.number().default(3000),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get port(): number {
    return Number(this.envConfig.SERVER_PORT);
  }

  private initProteinObject(TXTFilesPath: string): void {
    try {
      fs.readdir(TXTFilesPath, (err, files: string[]) => {
        if (err) {
          console.error(err);
          return;
        }
        files.forEach(async file => {
          const filrdir: string = path.join(TXTFilesPath, file);
          if (file !== 'txt.txt' && file !== 'txt2.txt') {
            return;
          }
          fs.stat(filrdir, (err, stats) => {
            if (err) {
              console.error(err);
              return;
            }
            if (stats.isFile()) {
              // // 创建一个文件流
              const inStream = fs.createReadStream(filrdir);
              const rl = readline.createInterface(inStream);
              // 开始解析操作
              rl.on('line', line => {
                const fastaName = line.split(':')[0];
                const idList = line.split(':')[1];
                let temList = idList.trim().split(' ');
                temList = [...new Set(temList)];
                try {
                  temList.forEach((ele: string) => {
                    this.proteinObject[ele] = fastaName;
                  });
                } catch (e) {
                  console.error(e);
                }
              });
            }
          });
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  get getProteinObject(): IProteinObject {
    return this.proteinObject;
  }
}
