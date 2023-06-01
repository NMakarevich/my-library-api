import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { compareHash } from '../../utils/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(signInDto: SignInDto) {
    const user = await this.userService.findByUsername(signInDto.username);
    if (!user) return null;
    const isMatch = await compareHash(signInDto.password, user.password);
    if (!isMatch) return null;
    const result = { ...user };
    delete result.password;
    return result;
  }

  async signIn(user: any) {
    const payload = { userId: user.id, username: user.username };
    return { token: await this.jwtService.signAsync(payload) };
  }
}
