import { BlogPost } from '../util/blog';
import { DateDisplay } from './date-display';

export interface PostInfoDisplayProps {
  readonly post: BlogPost;
}

export const PostInfoDisplay: React.FC<PostInfoDisplayProps> = (props) => (
  <p className="index-post-date-author">
    <span className="index-post-date">
      <DateDisplay date={new Date(Date.parse(props.post.date))} />
    </span>{' '}
    - <em>{props.post.author}</em>
    <style jsx>{`
      .index-post-date {
        text-transform: uppercase;
      }
    `}</style>
  </p>
);
