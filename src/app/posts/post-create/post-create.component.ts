import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from './../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  newPost ='Default Value';
  private mode = 'create';
  private postId: string;
  isLoading = false;
  imagePreview:any;
  image: any = '';
  private authStatusSub: Subscription;
  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe((authStatus)=>{
      this.isLoading = false;
    })
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
        .subscribe(result=>{
          this.isLoading = false;
          this.post = { id: result._id, title: result.title, content: result.content, imagePath: result.imagePath, creator: result.creator };
          this.image = result.imagePath;
          this.imagePreview = result.imagePath;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }

    });
  }

  /* onAddPost(userInput:HTMLTextAreaElement) {
    this.newPost=userInput.value;
  } */

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file)
    //console.log(file);
  }

  onSavePost(form:NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postsService.addPosts(form.value.title, form.value.content, this.image);
    } else {
      this.postsService.updatePosts(this.postId, form.value.title, form.value.content, this.image);
    }

  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
