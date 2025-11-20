export default interface IPost {
    _id: string;
    title: string;
    _type: string;
    _createdAt: string;
    _updatedAt: string;
    publishedAt: string;
    author: { _ref: string };
    postGenre: string;
    excerpt: string;
    mainImage: Object;
    thumbnail: Object;
    body: Array<object>;
    categories: Array<string>;
    slug: { current: string; _type: string };
    colourPrimary: Object;
    colourSecondary: Object;
}
