 /**
  * MyGameBoard class, which represents a Patch object
  */
 class MyBoard extends CGFobject {

     /**
      * @constructor
      * @param {XMLScene} scene           represents the CGFscene
      */
     constructor(scene, x = 4, y = 4) {
         super(scene);
         this.cube = new MyCube(scene, 10, 10);
         this.x = x;
         this.y = y;


         this.pieces = [
             [null, null, null, null],
             [null, null, null, null],
             [null, null, null, null],
             [null, null, null, null],
         ];

         this.grey = new CGFappearance(scene);
         this.grey.setAmbient(0.3, 0.3, 0.3, 1.0);
         this.grey.setDiffuse(0.3, 0.3, 0.3, 1.0);
         this.grey.setSpecular(1, 1, 1, 1.0);
         this.grey.setShininess(10.0);

     }

     update(currTime) {


         for (let i = 0; i < this.pieces.length; i++) {
             for (let j = 0; j < this.pieces[i].length; j++) {

                 if (this.pieces[i][j] != null)
                     this.pieces[i][j].update(currTime);

             }
         }
     }

     getPiece(x, y) {

         return this.pieces[y][x];
     }

     display() {

         //display of the pieces
         this.scene.pushMatrix();

         for (let i = 0; i < this.pieces.length; i++) {
             for (let j = 0; j < this.pieces[i].length; j++) {

                 if (this.pieces[i][j] != null) {

                     this.scene.pushMatrix();

                     if (this.pieces[i][j].animation != null)
                         this.pieces[i][j].animation.apply();

                     this.pieces[i][j].display();

                     this.scene.popMatrix();

                 }

             }

         }

         this.scene.popMatrix();


         //display of the board

         this.scene.pushMatrix();


         this.grey.apply();

         this.scene.scale(1, 0.3, 1);

         this.scene.translate(-0.25 * (this.y - 1), 0, 0.25 * (this.x - 1));

         for (let i = 0; i < this.x; i++) {

             this.scene.pushMatrix();

             for (let j = 0; j < this.y; j++) {

                 this.scene.pushMatrix();

                 if (this.isPieceLow(i, j)) {

                     this.scene.scale(1, 0.6, 1);

                 }


                 if (this.pieces[i][j] == null) {

                     this.scene.registerForPick((j + 1) * 10 + i + 1, this.cube);
                     this.cube.display();
                     this.scene.clearPickRegistration();
                 } else {

                     this.cube.display();
                 }

                 this.scene.popMatrix();

                 this.scene.translate(0.5, 0, 0);

             }

             this.scene.popMatrix();

             this.scene.translate(0, 0, -0.5);
         }

         this.scene.popMatrix();

     }

     isPieceLow(i, j) {

         if ((i >= 2) && (j == 0 || j == 1)) {

             return true;

         } else if ((i < 2) && (j == 2 || j == 3)) {

             return true;

         }

         return false;

     }

     updateTexCoords(s, t) {}
 }