import { animate, animateChild, group, query, sequence, stagger, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { R3TargetBinder } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/core/models/comment.model';
import { flashAnimation } from '../../animations/flash.animation';
import { slideAndSlideAnimation } from '../../animations/slide-and-fade.animation';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    trigger('listAnim', [
      transition(':enter',[
        query('@listItemAnim',[
          stagger(50, [animateChild()])
        ])
      ])
    ]),
    trigger('listItemAnim', [
      state('default', style({
        transform: 'scale(1)',
        'background-color': 'white',
        'z-index': 1
      })),
      state('active', style({
        transform: 'scale(1.05)',
        'background-color': 'rgb(201, 157, 242)',
        'z-index': 2
      })),
      transition('default => active', [
        animate('100ms ease-in-out')
      ]),
      transition('active => default', [
        animate('500ms ease-in-out')
      ]),
      // 'void => *' ou ':enter'
      transition('void => *', [
        query('.comment-text, .comment-date',[style({opacity:0})]),
        useAnimation(slideAndSlideAnimation, {
          params: {
            time: '500ms',
            startColor: 'rgb(201,157,242)'
          }
        }),
        group([
          useAnimation(flashAnimation, {
            params: {
              time: '250ms',
              flashColor: 'rgb(249,179,11)'
            }
          }),
          query('.comment-text', [
              animate('250ms', style({
                  opacity: 1
              }))
          ]),
          query('.comment-date', [
              animate('500ms', style({
                  opacity: 1
              }))
          ]),
        ])
      ])
    ])
  ]
})
export class CommentsComponent implements OnInit {

  @Input() comments!: Comment[];
  @Output() newComment = new EventEmitter<string>();

  animationStates: {[key:number]: 'default'|'active'} = {};
  // listItemAnimationState: 'default' | 'active' = 'default';

  commentCtrl!: FormControl;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void
  {
    this.commentCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(10)])
    for(let index in this.comments)
    {
      this.animationStates[index] = 'default';
    }
  }

  onLeaveComment()
  {
    if (this.commentCtrl.invalid) { return;}

    // on recupere l'id max
    const maxId = Math.max(...this.comments.map(x => x.id)); // spread avec ...
    // on insere au début
    this.comments.unshift({
      id: maxId+1,
      comment: this.commentCtrl.value,
      createdDate: new Date().toISOString(),
      userId: 1
    });

    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }

  onListItemMouseEnter(index: number)
  {
    //this.listItemAnimationState = 'active';
    this.animationStates[index] = 'active';
  }

  onListItemMouseLeave(index: number)
  {
    this.animationStates[index] = 'default';
    // this.listItemAnimationState = 'default';
  }

}
