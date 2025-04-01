import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { Exclude } from 'class-transformer';
import { DateScalar } from 'src/date.scalar';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profilePicture?: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  @Exclude()
  password: string;

  @Field()
  get mobile(): string {
    return this.phone;
  }

  @Field({ deprecationReason: "Use 'mobile' instead of 'phone'" })
  @Column()
  phone: string;

  @Field(() => DateScalar)
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: string;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.user, { eager: true })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, { eager: true })
  comments: Comment[];
}
