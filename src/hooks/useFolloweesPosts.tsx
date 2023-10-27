
import { useEffect, useState } from 'react';
import { useFollowing } from 'store/FollowingProvider';
import { PostType, usePosts } from 'store/PostsProvider';

export function useFolloweesPosts() {
    const [followeesPosts, setFolloweesPosts] = useState<PostType[] | undefined>();
    const { ids, follow, unFollow, isFollowing } = useFollowing();
    const { posts } = usePosts();

    useEffect(() => {
        const fetchFolloweesPosts = async () => {
            if (ids.length > 0) {
                const postsFilter: PostType[] | undefined = posts?.filter((posts) =>
                    ids.includes(posts.userUID)
                );
                console.log(posts)
                setFolloweesPosts(postsFilter);
            } else {
                setFolloweesPosts([]);
            }
        };

        fetchFolloweesPosts();
    }, [ids]);

    return {
        followeesPosts,
        follow,
        unFollow,
        isFollowing
    };
}
