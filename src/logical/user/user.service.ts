// src/logical/user/user.service.ts
import { Injectable } from '@nestjs/common';
import Sequelize from 'sequelize'; // 引入 Sequelize 库
import sequelize from '../../database/sequelize'; // 引入 Sequelize 实例

import fs from 'fs';
import readline from 'readline';

import { makeSalt, encryptPassword } from '../../util/cryptogram'; // 引入加密函数

@Injectable()
export class UserService {
  /**
   * 查询是否有该用户
   * @param username 用户名
   */
  async findOne(username: string): Promise<any | undefined> {
    const sql = `
      SELECT
        user_id , account_name , real_name , passwd ,
        passwd_salt , mobile, role
      FROM
        admin_user
      WHERE
        account_name = '${username}'
    `;
    try {
      const user = (await sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT, // 查询方式
        raw: true, // 是否使用数组组装的方式展示结果
        logging: true, // 是否将 SQL 语句打印到控制台
      }))[0];
      // 若查不到用户，则 user === undefined
      return user;
    } catch (error) {
      console.error(error);
      return void 0;
    }
  }

  /**
   * 注册
   * @param requestBody 请求体
   */
  async register(requestBody: any): Promise<any> {
    const { accountName, real_name, password, repassword } = requestBody;
    if (password !== repassword) {
      return {
        code: 400,
        msg: '两次密码输入不一致',
      };
    }
    const user = await this.findOne(accountName);
    if (user) {
      return {
        code: 400,
        msg: '用户已存在',
      };
    }
    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码
    const registerSQL = `
      INSERT INTO admin_user
        (account_name, real_name, passwd, passwd_salt, user_status, role, create_by)
      VALUES
        ('${accountName}','${real_name}','${hashPwd}', '${salt}', 1, 3, 0)
    `;
    try {
      await sequelize.query(registerSQL, { logging: false });
      return {
        code: 200,
        msg: 'Success',
      };
    } catch (error) {
      return {
        code: 503,
        msg: `Service error: ${error}`,
      };
    }
  }

  // 插入
  async insert(): Promise<any> {
    const instream = fs.createReadStream('./Orthogroups.txt');
    const rl = readline.createInterface(instream);

    let fastaIdList: any[] = [];
    let fastaIdIndex = 0;

    rl.on('line', function(line) {
      console.time('line count');

      // 解析文件内存，存入到数组
      const fastaName = line.split(':')[0];
      const idList = line.split(':')[1];
      let temList = idList.trim().split(' ');
      temList = [...new Set(temList)];
      try {
        temList.forEach(ele => {
          fastaIdList.push([ele, fastaName]);
        });
      } catch (e) {
        console.error(e);
      }
    });

    rl.on('close', function() {
      // 开启事务，保证批处理健康完成
      sequelize
        .transaction(t => {
          const tagIndex = 0;
          let sql = `INSERT INTO fasta (gene_id,fasta_id) VALUES`;
          // TODO:此处需要按长度切割后insert
          for (let i = 0; i < fastaIdList.length; i++) {
            const ele = fastaIdList[i];
            if (i === fastaIdList.length - 1) {
              console.log(i);
              sql = `${sql} ('${ele[0]}','${ele[1]}');`;
              break;
            }
            sql = `${sql} ('${ele[0]}','${ele[1]}'),`;
          }
          return sequelize.query(sql, {
            type: Sequelize.QueryTypes.INSERT,
            logging: false,
            transaction: t,
          });
        })
        .then(results => {
          console.log('操作成功');
        })
        .catch(err => {
          console.log('操作失败');
        });

      console.log(fastaIdList.splice(0, 100));
    });
  }
}
