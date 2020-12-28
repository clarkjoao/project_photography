import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService
    ){}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        const isMatch = await bcrypt.compare(pass, user.password);
        if (user && isMatch) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }
    
    async login(user: any) {
      const payload = { username: user.username, sub: user.userId };
      return {
        token: this.jwtService.sign(payload),
      };
    }
}
