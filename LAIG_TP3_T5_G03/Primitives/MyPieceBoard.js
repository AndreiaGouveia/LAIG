/**
 * MyPieceBoard class, which represents a Patch object
 */
class MyPieceBoard extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene           represents the CGFscene
     */
    constructor(scene , player) {
        super(scene);

        this.player = player;
        this.board = new PieceBoard(this.scene);

        this.pieces = [
            [new MyMarshmallow(this.scene , player), new MyMarshmallow(this.scene, player)],
            [new MyDonut(this.scene, player), new MyDonut(this.scene, player)],
            [new MyChristmasTree(this.scene, player), new MyChristmasTree(this.scene, player)],
            [new MyIceCream(this.scene, player), new MyIceCream(this.scene, player)],
        ];

        this.grey = new CGFappearance(scene);
        this.grey.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.grey.setDiffuse(0.3, 0.3, 0.3, 1.0);
        this.grey.setSpecular(1, 1, 1, 1.0);
        this.grey.setShininess(10.0);

        //this.scene.setPickEnabled(true);

    }

    logPicking() {

        if (this.scene.pickMode == false) {

            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

                for (var i = 0; i < this.scene.pickResults.length; i++) {
                    var obj = this.scene.pickResults[i][0];

                    if (obj) {
                        console.log(obj)
                        var customId = this.scene.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    display() {

        this.scene.pushMatrix();

        this.scene.scale(10, 10, 10);

        this.scene.pushMatrix();

        for (let i = 0; i < this.pieces.length; i++) {
            for (let j = 0; j < this.pieces[i].length; j++) {

                if (this.pieces[i][j] != null) {


                    this.scene.pushMatrix();
                    if(this.player == 0)
                    this.scene.translate((j - 2) * 0.5 -1.7 , 0.3, (2 - i) * 0.5 - 0.3 );//pieces
                    else  this.scene.translate((j - 2) * 0.5 + 3 , 0.3, (2 - i) * 0.5 - 0.3 );//pieces
                    this.pieces[i][j].display();

                    this.scene.popMatrix();

                }

            }

        }

        this.scene.popMatrix();
        
        if(this.player == 0)
        this.scene.translate(-2.5, 0 , 0.4);//board
        else this.scene.translate(2.3, 0 , 0.4);//board

        this.grey.apply();
        this.board.display(this.pieces);

        this.scene.pushMatrix();

        this.scene.translate(0.25, 1, 0.25);

        this.scene.popMatrix();
        this.scene.popMatrix();
    }

    updateTexCoords(s, t) {}
}