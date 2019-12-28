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

     display() {

         //display of the pieces
         this.scene.pushMatrix();

         this.scene.translate(0, 0.2, 0);

         for (let i = 0; i < this.pieces.length; i++) {
             for (let j = 0; j < this.pieces[i].length; j++) {

                 if (this.pieces[i][j] != null) {

                     this.scene.pushMatrix();

                     this.scene.translate((j - 2) * 0.5 + 0.25, 0, (2 - i) * 0.5 - 0.25);
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

         let higher = false;

         for (let i = 0; i < this.x; i++) {

             this.scene.pushMatrix();

             for (let j = 0; j < this.y; j++) {

                 this.scene.pushMatrix();

                 if (higher && (j == 0 || j == 1)) {

                     this.scene.scale(1, 0.6, 1);

                 } else if (!higher && (j == 2 || j == 3)) {

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

             if (i == 1) {
                 higher = true;
             }
         }

         this.scene.popMatrix();

     }

     updateTexCoords(s, t) {}
 }