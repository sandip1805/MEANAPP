import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/posts";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
private posts: Post[] = [];
private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http:HttpClient, private router: Router) { }

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
    this.http.get<{message: string,posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
    .pipe(map((postData)=>{
      return {
        posts: postData.posts.map(post=>{
          return {
            id:post._id,
            title:post.title,
            content:post.content,
            imagePath:post.imagePath,
            creator:post.creator
          }
        }),
        maxPosts: postData.maxPosts
      }
    }))
    .subscribe((transformedPostData)=>{
      this.posts = transformedPostData.posts
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts})
    })
  }

  getPostUpdateListner() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: String) {
    //return {...this.posts.find(p=> p.id === id)};
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(BACKEND_URL + "/"+ id);
  }
  addPosts(title: string, content: string, image: File) {
    //const post: Post = {title:title, content:content}
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{message: string, post: Post}>(BACKEND_URL, postData)
    .subscribe((responseData)=>{
      this.router.navigate(['/']);
    })
  }

  updatePosts(id: string, title: string, content: string, image: File | string) {
    //const post: Post = {title:title, content:content}
    let postData: Post | FormData;
    if(typeof image === 'object') {
        postData = new FormData();
        postData.append('id', id);
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
    } else {
      postData = {id:id, title, content, imagePath: image, creator: null};
    }
    this.http.put<{message: string}>(BACKEND_URL + "/"+ id, postData)
    .subscribe((responseData)=>{
      this.router.navigate(['/']);
    })
  }


  deletePosts(id: string) {
    return this.http.delete<{message: string}>(BACKEND_URL + "/"+ id);
  }
}
