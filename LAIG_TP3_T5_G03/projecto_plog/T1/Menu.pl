menus:-
        displayMainMenu,
        nl,
        read(Input),
        menuChoice(Input).

menuChoice(1):-
        initialBoard(InitialBoard),
        initGame(InitialBoard , 0).

menuChoice(2):-
        write('Thanks for playing!').

menuChoice(_):-
        write('Must choose between 1 or 2'),
        read(Input),
        menuChoice(Input).

initGame(Board , 16):-
        write('\n Game over!\n'),
        menus.
       
initGame(Board , Counter):-
        showBoard(white,Board),
        getPlay(Board , white),
        Counter1 is Counter + 1,
        showBoard(black,Board),
        getPlay(Board , black),
        Counter2 is Counter1 + 1,
        initGame(Board , Counter2).

displayMainMenu:-
        write('\n ----------------------------------------\n'),
        write('|                                        |\n'),
        write('|                Quantik                 |\n'),
        write('|                                        |\n'),
        write('|                                        |\n'),
        write('|                                        |\n'),
        write('|         Options:                       |\n'),
        write('|                    1- Start Game       |\n'),
        write('|                    2- Exit             |\n'),
        write('|                                        |\n'),
        write('|                                        |\n'),
        write(' ----------------------------------------\n').
