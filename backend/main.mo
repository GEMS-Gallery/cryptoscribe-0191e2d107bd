import Nat "mo:base/Nat";
import Order "mo:base/Order";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Debug "mo:base/Debug";

actor {
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  stable var posts: [Post] = [];
  stable var nextId: Nat = 0;

  public query func getPosts(): async [Post] {
    Array.sort(posts, func(a: Post, b: Post): Order.Order {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    })
  };

  public func createPost(title: Text, body: Text, author: Text): async () {
    let newPost: Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [newPost]);
    nextId += 1;
    Debug.print("New post created: " # title);
  };
}
