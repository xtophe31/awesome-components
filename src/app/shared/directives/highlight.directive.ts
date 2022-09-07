import { ThisReceiver } from "@angular/compiler";
import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from "@angular/core";

@Directive({
  selector: '[highlight]'
})


export class HighlightDirective
  implements AfterViewInit {

  //@Input() highlight = 'yellow'; // on peut utilise le nom de la directive pour passer un paramètre mais on pert la valeur par défaut
  @Input() color = 'yellow';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.setBackgroundColor(this.color);
  }

  setBackgroundColor(color: string)
  {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }

  @HostListener('mouseenter') onMouseEnter()
  {
    this.setBackgroundColor('lightgreen');
  }

  @HostListener('mouseleave') onMouseLeave()
  {
    this.setBackgroundColor(this.color);
  }

  @HostListener('click') onClick() {
    this.color = 'orange';
  }
}
