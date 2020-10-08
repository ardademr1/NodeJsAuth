import express from 'express';

const app = express();

let a: string;

app.get('/',(req,res)=>{
    res.send("hello");
});

app.listen(8080,() => console.log('Server Running'));

console.log("merhaba dünya");

/*  ||||||||--------Type Script Fonksiyonlar--------||||||||
    Örnek bir fonksiyon;

    function sayitopla(sayi1:number,sayi2:number):void{
        console.log(sayi1+sayi2);
        return;
    };
    sayitopla(10,20);

    ||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    ||||----------Type Script Sınıf ve Kalıtım----------||||
    Örnek bir sınıf;

    class Person{
        name: string;
        age: number;
        adress: string;

        constructor(name:string,age:number,adress:string){
            this.name=name;
            this.age=age;
            this.adress=adress;
            console.log("Kişi Oluşturuldu!");
        }
        showInfos(){
            console.log(`İsim: ${this.name} ,Yaş: ${this.age} ,Adres: ${this.adress}`);
        }
    }
    class Employee extends Person{
        maas : number;
        constructor(name: string,age: number,adress:string,maas:number){
            super(name,age,adress); //super class ımıza verilerimizi göndermiş oluyoruz.
            this.maas=maas;
        }
        showInfos(){
            super.showInfos();
            console.log(`,Maaş: ${this.maas}`);
        }
        changeDepartman(){
            console.log("Departman Değiştiriliyor.");
        }
    }
    let person1 = new Person("Arda Demir",22,"Ankara Yenimahalle");
    person1.showInfos();
    let employee1 = new Employee("Arda Demir",22,"Ankara Yenimahalle",1000);
    employee1.showInfos();
    employee1.changeDepartman();

    ||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    ||||||||---------Type Script Interface----------||||||||

    interface IDatabase{
        add();
        get();
        delete();
        update();
    }
    class MySql implements IDatabase{
        add(){
            console.log("MySql Add");
        }
        get(){
            console.log("MySql Get");
        }
        delete(){
            console.log("MySql Delete");
        }
        update(){
            console.log("MySql Update");
        }
    }
    class MangoDB implements IDatabase{
        add(){
            console.log("MangoDB Add");
        }
        get(){
            console.log("MangoDB Get");
        }
        delete(){
            console.log("MangoDB Delete");
        }
        update(){
            console.log("MangoDB Update");
        }
    }
    function addDatabase(database:IDatabase){
        database.add();
    }
    addDatabase(new MySql);
    addDatabase(new MangoDB);

    ||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    ||||||||---------Type Script Abstract----------|||||||||

    abstract class Database {
        add(){
            console.log("MangoDB Add");
        }
        get(){                                  // Add ve Get Ortak kullanılır(kalıtım metoduyla diğerlerinede geçirilir). delete ve update özel
            console.log("MangoDB Get");
        }
        abstract delete();
        abstract update();
        
    }
    class MySql extends Database{
        delete(){
            console.log("MySql Delete");
        }
        update(){
            console.log("MySql Update");
        }
    }
    class MangoDB extends Database{
        delete(){
            console.log("MangoDB Delete");
        }
        update(){
            console.log("MangoDB Update");
        }
    }


    ||||||||||||||||||||||||||||||||||||||||||||||||||||||||

*/