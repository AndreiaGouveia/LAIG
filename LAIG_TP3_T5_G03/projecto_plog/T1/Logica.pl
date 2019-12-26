getColumn(X):-
	repeat,
	write('O valor da coluna tem de ser entre \'a\' e \'d\'\n'),
	read(X1),
	char_code(X1,X2),
	X2=<100,
	X2>=97,
	X is X2-96.

getLine(Y):-
	repeat,
	write('O valor da linha tem de ser entre 1 e 4\n'),
	read(Y),
	Y=<4,
	Y>=1.

getCoord(X , Y , Board):-
	write('Insere um valor entre \'a\' a \'d\'\n'),
	getColumn(X),
	write('Insere um valor entre 1 a 4\n'),
	getLine(Y),
	validMove(X,Y,Board).

validMove(0,0,H):-
	H=='empty'.

validMove(1,0,[H|_]):-
	validMove(0,0,H).

validMove(X,0,[_|T]):-
	X1 is X-1,
	validMove(X1,0,T).

validMove(X,1,[H|_]):-
	validMove(X,0,H).

validMove(X,Y,[_|T]):-
	Y1 is Y-1,
	validMove(X,Y1,T).

getPlay(Board, Player):-
	getCoord(X , Y , Board).




