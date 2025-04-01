import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUser, UpdateUser } from './user.dto';
import { UseGuards } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { GqlAuthGuard } from './gql-auth.guard';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@ObjectType()
class AuthResponse {
  @Field()
  accessToken: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  getUsers(@Args('id', { nullable: true }) id?: string) {
    if (id) {
      return [this.userService.findOne(id)];
    }
    return this.userService.findAll();
  }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUser) {
    return this.userService.create(input);
  }

  @Mutation(() => AuthResponse)
  logIn(@Args('email') email: string, @Args('password') password: string) {
    return this.userService.logIn(email, password);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async uploadProfilePicture(
    @Context('req') req,
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    try {
      const { createReadStream, filename } = file;

      const uploadPath = join(__dirname, '../../uploads', filename);
      const fileUrl = `http://localhost:5000/uploads/${filename}`;

      await new Promise<string>((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(uploadPath))
          .on('finish', () => resolve(fileUrl))
          .on('error', reject);
      });

      // Update user's profile picture
      const updatedUser = await this.userService.updateProfilePicture(
        req.user.id,
        fileUrl,
      );

      return updatedUser.profilePicture;
    } catch {
      throw new Error('File upload failed');
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  updateUser(@Context('req') req, @Args('input') input: UpdateUser) {
    return this.userService.update(req.user.id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  deleteUser(@Context('req') req) {
    return this.userService.delete(req.user.id);
  }
}
