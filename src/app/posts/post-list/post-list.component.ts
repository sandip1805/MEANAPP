import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Post } from './../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  /* posts = [{
    title:'First Post', content:'first post\'s content'
  },
  {
    title:'Second Post', content:'second post\'s content'
  },
  {
    title:'Third Post', content:'third post\'s content'
  }]; */
  isLoading = false;
  posts:Post[] = [];
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [2, 5, 10, 25];
  currentPage = 1;
  private postsSub:Subscription;
  private authListnerSub: Subscription;
  userIsAuthenticated=false;
  userId: string;
  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListner()
    .subscribe((postData: {posts: Post[], postCount: number})=>{
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSub = this.authService.getAuthStatusListner().subscribe((isAuthenticated)=>{
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
    })

    console.log(this.userIsAuthenticated);
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    //console.log(pageData);
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePosts(id).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, error =>{
      this.isLoading = false;
    })


  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListnerSub.unsubscribe();
  }
}
