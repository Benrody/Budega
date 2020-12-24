import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController, MenuController } from '@ionic/angular';
//////////////////////////////////////////////
import _ from 'lodash';
/////////////////////////////////////////////

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],

})

export class HomePage implements OnInit {
  private loading: any;
  public products = new Array<Product>();
  private productsSubscription: Subscription;
  ///////////////////////////////////////
  classificados: Array<{nome:string}>
  allClassificados: any;
  queryText: string;
//////////////////////////////////////////
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private toastCtrl: ToastController,
    private menu: MenuController,
  ) {
    this.getProductsList();
    this.queryText = '';
    this.classificados = [
      {nome: 'carro'},
      {nome: 'moto'},
      {nome: 'casa'},
      {nome: 'bicicleta'},
      {nome: 'celular'},
    ];
    this.allClassificados = this.classificados;
  }

  getProductsList(){
    this.productsSubscription = this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  filterClassificados( event: any){
    this.getProductsList();
    let textoDaBusca = event.target.value.toLowerCase();
    if (textoDaBusca && textoDaBusca.trim() != '') {
      this.products = this.products.filter((item) => {
        return (item.name.toLowerCase().indexOf(textoDaBusca.toLowerCase()) > -1);
      });
    }
  }
///////////////////////////////////////////////////////////////////////
  ngOnInit() { }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }

  async logout() {
    await this.presentLoading();

    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async deleteProduct(id: string) {
    try {
      await this.productService.deleteProduct(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }


  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  

}