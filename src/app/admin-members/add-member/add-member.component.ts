import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from '../../model/member.model';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  member: Member;
  createMemberForm: FormGroup;
  imageSrc = '';
  error = '';

  constructor(private membersService: MembersService, private route: ActivatedRoute,
              private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initForm();

    // @ts-ignore
    this.member = new Member();
  }

  get surname(): AbstractControl | null { return this.createMemberForm.get('surname'); }
  get name(): AbstractControl | null { return this.createMemberForm.get('name'); }
  get description(): AbstractControl | null { return this.createMemberForm.get('description'); }
  get phone(): AbstractControl | null { return this.createMemberForm.get('phone'); }
  get email(): AbstractControl | null { return this.createMemberForm.get('email'); }

  initForm(): void {
    this.createMemberForm = this.formBuilder.group({
      surname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      description: ['', [Validators.required, Validators.maxLength(130)]],
      phone: ['', Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      email: ['', [Validators.email, Validators.required]],
    });
  }

  onAddMember(): void {
    const formValue: Member = this.createMemberForm.value;
    this.member.surname = formValue.surname;
    this.member.name = formValue.name;
    this.member.description = formValue.description;
    this.member.phone = formValue.phone;
    this.member.email = formValue.email;
    if (this.imageSrc !== '') {
      this.member.photo = this.imageSrc;
    }

    this.membersService.addMember(this.member).subscribe(
      (data) => {
        console.log(data);
      },
      (e) => {
        const err = JSON.parse(e.error);
        this.error = err.detail;
      },
      () => {
        this.router.navigate(['/adminMembers']);
      }
    );
  }

  // @ts-ignore
  handleInputChange(e): void {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  // @ts-ignore
  handleReaderLoaded(e): void {
    const reader = e.target;
    this.imageSrc = reader.result;
    console.log(this.imageSrc);
  }

}
