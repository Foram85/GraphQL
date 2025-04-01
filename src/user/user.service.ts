import { CreateUser, UpdateUser } from './user.dto';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new Error('User not found');
    return user;
  }

  async create(input: CreateUser): Promise<User> {
    if (await this.findByEmail(input.email)) {
      throw new ConflictException('User already exists');
    }

    const newUser = this.repo.create({
      ...input,
      password: await bcrypt.hash(input.password, 10),
    });
    return await this.repo.save(newUser);
  }

  async logIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    };
  }

  async updateProfilePicture(id: string, filePath: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new Error('User not found');

    user.profilePicture = filePath;
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repo.findOne({ where: { email } });
  }

  async update(id: string, input: UpdateUser): Promise<User> {
    const user = await this.findOne(id);
    return this.repo.save(Object.assign(user, input));
  }

  async delete(id: string): Promise<string> {
    await this.findOne(id);
    await this.repo.delete(id);
    return `User has been deleted successfully.`;
  }
}
