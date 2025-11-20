import IPost from "../interface/post";
import Post from "../models/post";

export const createPost = async (post: IPost) => {
    await Post.create({
        _id: post._id,
        title: post.title,
        _type: post._type,
        _createdAt: post._createdAt,
        _updatedAt: post._updatedAt,
        publishedAt: post.publishedAt,
        author: post.author,
        excerpt: post.excerpt,
        mainImage: post.mainImage,
        thumbnail: post.thumbnail,
        postGenre: post.postGenre,
        body: post.body,
        categories: post.categories,
        slug: post.slug,
        colourPrimary: post.colourPrimary,
        colourSecondary: post.colourSecondary,
    });
};

// postID any pour le moment; ça suffit
export const updatePost = async (post: IPost, postID: any) => {
    await Post.findByIdAndUpdate(postID, {
        title: post.title,
        _type: post._type,
        _updatedAt: post._updatedAt,
        publishedAt: post.publishedAt,
        excerpt: post.excerpt,
        mainImage: post.mainImage,
        thumbnail: post.thumbnail,
        postGenre: post.postGenre,
        body: post.body,
        categories: post.categories,
        slug: post.slug,
        colourPrimary: post.colourPrimary,
        colourSecondary: post.colourSecondary,
    });
};
