import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Comment } from 'src/comment/comment.entity';
import { DateScalar } from 'src/date.scalar';

@ObjectType()
@Entity()
export class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Directive('@upper')
  @Column()
  title: string;

  @Field()
  @Column()
  content: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  @Field(() => DateScalar)
  createdAt: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
  comments?: Comment[];
}
