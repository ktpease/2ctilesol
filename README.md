# 🀄 Two-Corner Tile Solitaire 🀄

A simple web adaptation, developed with [React](https://reactjs.org/), of the tile puzzle game known as both "Nikakudori" or "Shisen-Sho".

**It can be played [here!](https://ktpease.github.io/2ctilesol)**

This project utilizes the [Mahjong Tiles Unicode block](https://en.wikipedia.org/wiki/Mahjong_Tiles_(Unicode_block)) for displaying tiles, either building on the standard glyphs or with fonts supporting non-standard emoji variants (such as Microsoft's Segoe UI Emoji). It will not display correctly in earlier browsers and may not display correctly with certain fonts.

## The Game

The game itself is similar to [Mahjong solitaire](https://en.wikipedia.org/wiki/Mahjong_solitaire), in which players clear a board full of mahjong tiles by matching pairs that are exposed (or "open").

While all tiles are considered exposed, they can only be matched if they follow the rules of "nikakudori" (or "two-angle take"), in which an imaginary path of 1-3 orthogonal line segments must be imagined between them so that no line touches any other line (which, by definition, forms less than three right angles, or "corners").

More information on the game itself can be found at [Wikipedia](https://en.wikipedia.org/wiki/Shisen-Sho).

---
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).