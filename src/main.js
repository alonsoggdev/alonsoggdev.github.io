import { scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue } from "./utils";

// Carga el spritesheet
k.loadSprite("spritesheet", "../sprites/spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "idle-down": 936,
        "walk-down": {from: 935, to: 939, loop: true, speed: 8},
        "idle-side": 975,
        "walk-side": {from: 975, to: 978, loop: true, speed: 8},
        "idle-up": 1014,
        "walk-up": {from: 1014, to: 1017, loop: true, speed: 8},
    },
});

k.loadSprite("map", "../maps/map.png");

k.setBackground(k.Color.fromHex('#311047'));

k.scene("main", async () => {
    const mapData = await (await fetch("../maps/map.json")).json();
    const layers = mapData.layers;

    const map = k.add([
        k.sprite("map"),
        k.pos(0),
        k.scale(scaleFactor)
    ]);
    
    const player = k.make([
        k.sprite("spritesheet", {
            anim: "idle-down"
        }),
        k.area({
            shape: new k.Rect(k.vec2(0, 3), 10, 10)
        }),
        k.body(),
        k.anchor("center"),
        k.pos("placeholder"),
        k.scale(scaleFactor),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false,
        },
        "player",
    ]);

    for (const layer of layers) {
        if (layer.name === "boundaries") {
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name,
                ]);

                if (boundary.name) {
                    player.onCollide(boundary.name, () =>{
                        player.isInDialogue = true;
                        displayDialogue("TODO", () => player.isInDialogue = false);
                    })
                }
            }
            continue;
        }
        if (layer.name === "spawnpoints") {
            for (const entity of layer.objects) {
                if (entity.name === 'player') {
                    player.pos = k.vec2(
                        (map.pos.x + entity.x * scaleFactor),
                        (map.pos.y + entity.y * scaleFactor)
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y + 100);
    });

});

k.go("main");