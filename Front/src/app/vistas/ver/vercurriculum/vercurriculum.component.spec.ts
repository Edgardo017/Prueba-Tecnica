import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VercurriculumComponent } from './vercurriculum.component';

describe('VercurriculumComponent', () => {
  let component: VercurriculumComponent;
  let fixture: ComponentFixture<VercurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VercurriculumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VercurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
