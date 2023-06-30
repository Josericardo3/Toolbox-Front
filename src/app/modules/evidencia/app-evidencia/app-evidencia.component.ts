import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// const fs = require('fs-extra')
// import { readFile, writeFile } from 'fs/promises';
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from 'src/app/servicios/file-upload/file-upload.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-evidencia',
  templateUrl: './app-evidencia.component.html',
  styleUrls: ['./app-evidencia.component.css']
})
export class AppEvidenciaComponent implements OnInit{
  @ViewChild('archivo') archivo: ElementRef<HTMLInputElement>;

  lastVisible: any;

  contextsVisible = false;
  subContextsVisible = false;
  liderazgoVisible = false;
  planificacionVisible = false;
  subPlanificacionA = false;
  subPlanificacionB = false;
  apoyoVisible = false;
  subApoyoVisible = false;
  operacionVisible = false;
  evaluacionVisible = false;
  subEvaluacionVisible = false;
  mejoraVisible = false;
  anexoAVisible = false;
  anexoBVisible = false;
  anexoCVisible = false;

  subirVisible41 = false;
  subirVisible42 = false;
  subirVisible43 = false;
  subirVisible44 = false;
  subirVisible451 = false;
  subirVisible452 = false;
  subirVisible51 = false;
  subirVisible52 = false;
  subirVisible53 = false;
  subirVisible611 = false;
  subirVisible612 = false;
  subirVisible621 = false;
  subirVisible71 = false;
  subirVisible72 = false;
  subirVisible73 = false;
  subirVisible74 = false;
  subirVisible751 = false;
  subirVisible752 = false;
  subirVisible753 = false;
  subirVisible81 = false;
  subirVisible82 = false;
  subirVisible83 = false;
  subirVisible91 = false;
  subirVisible922 = false;
  subirVisible93 = false;
  subirVisible101 = false;
  subirVisible102 = false;
  subirVisibleA = false;
  subirVisibleB = false;
  subirVisibleC = false;

  public file: File | any;
  public loading: boolean;
  public archivos: any = []

  private selectedFile: File;
  public fileName: string;
  
  constructor(
    private http: HttpClient,
    private FileUploadService: FileUploadService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void { 
        // Detectar el parámetro en la URL y, si es "liderazgo", desplegar la sección correspondiente
        this.route.paramMap.subscribe(params => {
          if (params.get('section') === 'contexts') {
            this.contextsVisible = true;
            if (params.get('subSection') === 'subContexts') {
              this.subContextsVisible = true;
            }
          } else if (params.get('section') === 'liderazgo') {
            this.liderazgoVisible = true;
          } else if (params.get('section') === 'planificacion') {
            this.planificacionVisible = true;
            if (params.get('subSection') === 'subPlanificacionA') {
              this.subPlanificacionA = true;
            } else if (params.get('subSection') === 'subPlanificacionB') {
              this.subPlanificacionB = true;
            }
          }  else if (params.get('section') === 'apoyo') {
            this.apoyoVisible = true;
            if (params.get('subSection') === 'subApoyo') {
              this.subApoyoVisible = true;
            }
          } else if (params.get('section') === 'operacion') {
            this.operacionVisible = true;
          } else if (params.get('section') === 'evaluacion') {
            this.evaluacionVisible = true;
            if (params.get('subSection') === 'subEvaluacion') {
              this.subEvaluacionVisible = true;
            }
          } else if(params.get('section') === 'mejora') {
            this.mejoraVisible = true;
          } else if(params.get('section') === 'anexoA') {
            this.anexoAVisible = true;
          } else if(params.get('section') === 'anexoB') {
            this.anexoBVisible = true;
          } else if(params.get('section') === 'anexoC') {
            this.anexoCVisible = true;
          }
        });
  }

  capturarFile(){
    const archivoSeleccionado = this.archivo.nativeElement.files[0];
    const nombreArchivo = document.querySelector('#nombre') as HTMLElement;
    if (archivoSeleccionado) {
      nombreArchivo.innerText = archivoSeleccionado.name;
    } else {
      nombreArchivo.innerText = '';
    }
  }

  private serverUrl = 'http://localhost:4200/evidencia'; // Reemplaza con la URL de tu servidor
  uploadFile(): void {
    const archivo = (<HTMLInputElement>document.getElementById('archivo')).files[0];
    const formData = new FormData();
    formData.append('archivo', archivo);
  
    this.http.post(this.serverUrl, formData).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    );
    console.log('entró')
    // if (this.file && this.file.size <= 10485760) { // 10 MB en bytes
    //   const reader = new FileReader();
    //   reader.readAsDataURL(this.file);
    //   reader.onload = (e: ProgressEvent) => {
    //     const contents = (e.target as FileReader).result as string;
    //     const fileName = this.file.name;
    //     const fileData = reader.result.toString().split(',')[1];
    //     const filePath = `uploads/${fileName}`;
    //     // localStorage.setItem(filePath, fileData);
    //     localStorage.setItem(filePath, contents);
    //     // Copia el archivo del Local Storage a la carpeta local "uploads"
    //   // fs.writeFileSync('./uploads/' + this.file.name, contents);
    //   };
    // } else {
    //   console.error('El archivo es demasiado grande. El tamaño máximo es de 10 MB.');
  }
  
  private saveFileToAssetsFolder(file: File): void {
      const apiUrl = 'http://localhost:4200/evidencia'; // URL de tu servidor API
      const formData = new FormData();
      formData.append('file', file, './uploads/' + file.name); // ruta de la subcarpeta de assets
    
      this.http.post(apiUrl, formData).subscribe(
        response => {
          console.log('File saved successfully');
        },
        error => {
          console.error('Error saving file:', error);
        }
      );
  }

  toggleSection(section) {
    if (section === 'contexts') {
      this.contextsVisible = !this.contextsVisible;
    } else if (section === 'subContexts') {
      this.subContextsVisible = !this.subContextsVisible;
    } else if (section === 'liderazgo') {
      this.liderazgoVisible = !this.liderazgoVisible;
    } else if (section === 'planificacion') {
      this.planificacionVisible = !this.planificacionVisible;
    } else if (section === 'subPlanificacionA') {
      this.subPlanificacionA = !this.subPlanificacionA;
    } else if (section === 'subPlanificacionB') {
      this.subPlanificacionB = !this.subPlanificacionB;
    } else if (section === 'apoyo') {
      this.apoyoVisible = !this.apoyoVisible;
    } else if (section === 'subApoyo') {
      this.subApoyoVisible = !this.subApoyoVisible;
    } else if (section === 'operacion') {
      this.operacionVisible = !this.operacionVisible;
    } else if (section === 'evaluacion') {
      this.evaluacionVisible = !this.evaluacionVisible;
    } else if (section === 'subEvaluacion') {
      this.subEvaluacionVisible = !this.subEvaluacionVisible;
    } else if (section === 'mejora') {
      this.mejoraVisible = !this.mejoraVisible
    } else if (section === 'anexoA') {
      this.anexoAVisible = !this.anexoAVisible;
    } else if (section === 'anexoB') {
      this.anexoBVisible = !this.anexoBVisible;
    } else if (section === 'anexoC') {
      this.anexoCVisible = !this.anexoCVisible;
    }
    
    // Cierra el div abierto si se hace clic en otro div
    if (this.lastVisible && this.lastVisible !== section) {
      if (this.lastVisible === 'contexts') {
        this.contextsVisible = false;
      } else if (this.lastVisible === 'subContexts') {
        this.subContextsVisible = false;
      } else if (this.lastVisible === 'liderazgo') {
        this.liderazgoVisible = false;
      } else if (this.lastVisible === 'planificacion') {
        this.planificacionVisible = false;
      } else if (this.lastVisible === 'subPlanificacionA') {
        this.subPlanificacionA = false;
      } else if (this.lastVisible === 'subPlanificacionB') {
        this.subPlanificacionB = false;
      } else if (this.lastVisible === 'apoyo') {
        this.apoyoVisible = false;
      } else if (this.lastVisible === 'subApoyo') {
        this.subApoyoVisible = false;
      } else if (this.lastVisible === 'operacion') {
        this.operacionVisible = false;
      } else if (this.lastVisible === 'evaluacion') {
        this.evaluacionVisible = false;
      } else if (this.lastVisible === 'subEvaluacion') {
        this.subEvaluacionVisible = false;
      } else if(this.lastVisible === 'mejora') {
        this.mejoraVisible = false;
      } else if(this.lastVisible === 'anexoA') {
        this.anexoAVisible = false;
      } else if(this.lastVisible === 'anexoB') {
        this.anexoBVisible = false;
      } else if(this.lastVisible === 'anexoC') {
        this.anexoCVisible = false;
      }
    }
    
    this.lastVisible = section;

  }

  toggleSubContexts() {
    this.subContextsVisible = !this.subContextsVisible;
  }

  toggleSubPlanificacionA(){
    this.subPlanificacionA = !this.subPlanificacionA;
  }

  toggleSubPlanificacionB(){
    this.subPlanificacionB = !this.subPlanificacionB;
  }

  toggleSubApoyo(){
    this.subApoyoVisible = !this.subApoyoVisible;
  }

  toggleSubEvaluacion(){
    this.subEvaluacionVisible = !this.subEvaluacionVisible;
  }

  toggleSubir(section: any){
    if (section === 'item41') {
      this.subirVisible41 = !this.subirVisible41;
    } else if (section === 'item42') {
      this.subirVisible42 = !this.subirVisible42;
    } else if (section === 'item43') {
      this.subirVisible43 = !this.subirVisible43;
    } else if (section === 'item44') {
      this.subirVisible44 = !this.subirVisible44;
    } else if (section === 'item451') {
      this.subirVisible451 = !this.subirVisible451;
    } else if (section === 'item452') {
      this.subirVisible452 = !this.subirVisible452;
    } else if (section === 'item51') {
      this.subirVisible51 = !this.subirVisible51;
    } else if (section === 'item52') {
      this.subirVisible52 = !this.subirVisible52;
    } else if (section === 'item53') {
      this.subirVisible53 = !this.subirVisible53;
    } else if (section === 'item611') {
      this.subirVisible611 = !this.subirVisible611;
    } else if (section === 'item612') {
      this.subirVisible612 = !this.subirVisible612;
    } else if (section === 'item621') {
      this.subirVisible621 = !this.subirVisible621;
    } else if (section === 'item71') {
      this.subirVisible71 = !this.subirVisible71;
    } else if (section === 'item72') {
      this.subirVisible72 = !this.subirVisible72;
    } else if (section === 'item73') {
      this.subirVisible73 = !this.subirVisible73;
    } else if (section === 'item74') {
      this.subirVisible74 = !this.subirVisible74;
    } else if (section === 'item751') {
      this.subirVisible751 = !this.subirVisible751;
    } else if (section === 'item752') {
      this.subirVisible752 = !this.subirVisible752;
    } else if (section === 'item753') {
      this.subirVisible753 = !this.subirVisible753;
    } else if (section === 'item81') {
      this.subirVisible81 = !this.subirVisible81;
    } else if (section === 'item82') {
      this.subirVisible82 = !this.subirVisible82;
    } else if (section === 'item83') {
      this.subirVisible83 = !this.subirVisible83;
    } else if (section === 'item91') {
      this.subirVisible91 = !this.subirVisible91;
    } else if (section === 'item922') {
      this.subirVisible922 = !this.subirVisible922;
    } else if (section === 'item93') {
      this.subirVisible93 = !this.subirVisible93;
    } else if (section === 'item101') {
      this.subirVisible101 = !this.subirVisible101;
    } else if (section === 'item102') {
      this.subirVisible102 = !this.subirVisible102;
    } else if (section === 'itemA') {
      this.subirVisibleA = !this.subirVisibleA;
    } else if (section === 'itemB') {
      this.subirVisibleB = !this.subirVisibleB;
    } else if (section === 'itemC') {
      this.subirVisibleC = !this.subirVisibleC;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard'])
  }
}
