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

    this.initProteinObject(this.TXTFilesPath).then(res => {
      this.proteinObject = res;
    });
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

  private async initProteinObject(TXTFilesPath: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      fs.readdir(TXTFilesPath, (err, files: string[]) => {
        if (err) {
          console.error(err);
          return;
        }
        const promises = files.map(file => {
          return new Promise((resolve, reject) => {
            const filrdir: string = path.join(TXTFilesPath, file);
            if (path.extname(filrdir) === '.txt') {
              fs.stat(filrdir, async (err, stats) => {
                if (err) {
                  console.error(err);
                  return;
                }
                if (stats.isFile()) {
                  const rl = readline.createInterface(
                    fs.createReadStream(filrdir),
                  );
                  const proteinObject: IProteinObject = {};
                  for await (const line of rl) {
                    const fastaName = line.split(':')[0];
                    const idList = line.split(':')[1];
                    let temList = [];
                    temList = [...new Set(idList.trim().split(' '))];
                    for (let i = 0; i < temList.length; i++) {
                      const ele = temList[i];
                      proteinObject[ele] = fastaName;
                    }
                  }
                  resolve(proteinObject);
                }
              });
            } else {
              resolve({});
            }
          });
        });
        let res = {};
        Promise.all(promises).then(arr => {
          arr.forEach(item => Object.assign(res, item));
          resolve(res);
        });
      });
    });
  }

  get getProteinObject(): IProteinObject {
    return this.proteinObject;
  }
}
