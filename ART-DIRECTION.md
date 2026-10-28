# 旧版2.5D素材存档

2026-10-28：主场景已改为人物高度的像素透视视角；本文件描述的屋顶图片作为旧素材保留，不再用于主场景屋顶渐隐。当前永久实体屋顶、墙面和像素材质由场景代码绘制。

# 像素房屋美术

生成方式：内置 image_gen，透明背景。已复制并实际引用 public/art/cottage-exterior-pixel.png。原版 normal.png 作为风格参考；三套原地图保留，供原版运行地图和主场景地面使用。

最终提示词：

Create a beautiful GAME SPRITE of the COMPLETE EXTERIOR of the cottage from the provided pixel garden reference. Use reference for exact premium pixel art quality, warm colors, ivory plaster and honey-brown timber material, rich ivy and fine texture. CRITICAL style: hand-placed crisp 16-bit PIXEL ART clusters, late SNES / detailed indie RPG sprite, genuinely sharp pixels. Not a smooth 3D render, not vector, not painterly blur. CRITICAL camera/layout: orthographic TOP-DOWN THREE-QUARTER view, facing directly north so the long FRONT wall runs horizontally, no isometric diagonal rotation. House silhouette is a broad rectangle about 1.36 times as wide as tall including roof. The long main gabled roof has its ridge running LEFT to RIGHT, detailed olive sage shingles with dappled golden highlights, weathered edges, a little chimney, dormer and ivy at edges. Roof occupies top 65% of silhouette; front vertical ivory-and-timber wall occupies lower 35%, with two tiny glowing windows. The ONE open arched entry door MUST be near the FAR RIGHT of the front facade: centered at 89% of total sprite width. The doorway opens into black shadow and has three small straight steps extending south. Front door must NOT be centered. Add warm brass lantern beside this right-side door, climbing pink/cream roses, a flower windowbox, slate trim, delicate warm sunlight from upper left and shadow on right wall. No visible interior. This sprite overlays an existing cutaway room and disappears when entering. TRANSPARENT background everywhere outside the building silhouette, including transparent lower-left outside the wall; no garden, no ground rectangle, no sky, no border, no characters, no UI, no lettering, no watermark. Entire building visible with only a small transparent margin. Exquisite dimensional roof volume and facade depth, entirely pixel art, just as textured and lovingly detailed as the reference.

素材输出后依据实际门洞位置调整绘制坐标，原入口通行坐标保持不变。素材按低分辨率缩小绘制，渲染关闭平滑过滤，主游戏桌面采用两倍整数缩放。


## 人物视角美术升级素材（已实际接入）

使用内置 image_gen，以原 `normal.png` 的颜色、精细像素簇和材质层次为参考。以下素材位于本项目 `public/art/`，由 `PixelArtLibrary.ts` 与 `PerspectiveGarden.ts` 读取：

1. `materials-premium-pixel.png`：2×2 图集，左上木地板、右上奶油石灰墙、左下苔石、右下树叶。
2. `furniture-premium-pixel.png`：2×2 图集，左上书架表面、右上抽屉表面、左下绿色信箱、右下花纹地毯。贴到有厚度的家具上，不再把整幅原地图当作室内画面。
3. `flowers-premium-pixel.png`：带真实 alpha 的奶油雏菊、粉玫瑰与蓝紫花穗组合，应用于花园中的交叉几何。

最终提示词要点：

Materials: Professional 2x2 GAME MATERIAL TEXTURE ATLAS, exactly four equal quadrants without borders, gaps or labels. Match original cozy map's exquisite densely detailed hand-crafted pixel clusters and warm restrained colors. Flat orthographic seamless surface scans: honey oak with grain and knots; ivory plaster with subtle age speckles; irregular mossy worn cobblestones; densely layered sage/olive leaves. No coarse voxels, random colored noise, blur, photorealism or UI.

Furniture: Production 2x2 texture atlas with four equal edge-to-edge quadrants, faithful to the original cozy interior. Orthographic front faces of richly detailed oak bookcase filled with varied book spines; two-drawer honey oak chest with brass pulls; vintage sage green mailbox face with slot and keyhole; overhead sage/gold woven botanical rug. Fine hand-drawn pixel art, no room backdrop, perspectives or labels.

Flowers: One premium transparent garden clump in the reference map's refined pixel style. Layered sage and olive leaves, cream daisies with golden hearts, dusty pink roses, lavender-blue spikes, fine grass and ivy. Frontal organic irregular mound, full silhouette, about 1.6 times wider than tall. Tiny crisp pixel clusters, subtle warm light, true alpha gaps. No Minecraft blocks, 3D render, blur, text, pot or ground rectangle.


## 墙面海报图集（2026-10-28）

- 使用内置 image_gen，非 CLI。项目素材：`public/art/wall-prints-pixel.png`，以 `PixelArtLibrary.ts` 在运行时按四象限读取，保留原图不覆盖旧素材。
- 图集四格：植物标本、黄昏花园小屋、生日蛋糕、新年月夜灯笼。海报图像是纸面印刷插画，墙上的框、内衬、阴影由实际几何承担。
- 原始生成文件：`C:/Users/70228/.codex/generated_images/01a1682c-9b78-7a51-8a76-2cd25db36859/exec-aedf19d1-315e-4adb-be8b-291b00e09058.png`。

最终提示词：
Use case: game-asset. Create ONE professional 2x2 square pixel art POSTER TEXTURE ATLAS for a lovingly detailed cozy 16-bit cottage game. Exactly four equal square quadrants edge to edge, no gaps, no outside mockup or shadows. Each quadrant is a finished flat printed illustration on slightly aged ivory paper, with a tasteful narrow paper margin INSIDE each quadrant; no wooden frames (actual geometry adds frames). Upper left: exquisitely delicate botanical field study of cream daisies, sage eucalyptus, tiny dusty pink blossoms, a small butterfly, arranged like a treasured natural history plate. Upper right: tranquil landscape of a little sage-roofed cream cottage in an abundant garden, golden evening light and a stone footpath. Lower left: charming still life of a birthday cake with little strawberries and candles, a ribbon and flowers, restrained dusty rose, cream and warm amber. Lower right: sophisticated lunar new year art print with two warm vermilion lanterns among plum blossom branches and a small golden full moon, muted navy and deep red with cream margins. Style: true crisp refined pixel-art clusters, original high-quality indie pixel adventure aesthetics, detailed microshading, clear compositions readable at 128x128 each. Colors warm and restrained, tactile paper and ink. No random noise, no chunky voxel art, no smooth 3D, no blur, no photography. No words, letters, numbers, logos or watermarks. Four distinct prints, perfectly aligned 2x2 tiles.


## 自然花园表面图集（2026-10-28）

工具：内置 image_gen。项目保存路径：`public/art/garden-surfaces-pixel.png`。原始输出：`C:/Users/70228/.codex/generated_images/01a1682c-9b78-7a51-8a76-2cd25db36859/exec-1fe60baf-e682-44ff-8a30-f8bf7b8e3c6e.png`。四格对应草地、树皮、叶面、花瓣，分别用于实例化草坪、曲面树干和实际叶片/花瓣几何；没有将整幅花园图作为立体场景。

最终提示词：
Use case: game-asset. One high quality 2x2 equal-quadrant PBR ALBEDO texture atlas for a beautiful immersive cozy pixel-art garden. Four square material tiles, exactly equal size, seamless and edge-to-edge within each quadrant, no frame, gaps, labels, perspective or scene objects. True exquisitely detailed handcrafted pixel clusters, late SNES / premium indie pixel adventure style. Restrained organic colors, natural materials, crisp pixel edges, no vector, voxels, blur or photography. Upper left: seamless lush short meadow grass seen directly overhead, interwoven fine narrow blades and small clover leaves, subtle sage, moss green and olive variations on earthy green ground; low contrast, natural nonuniform density, no flowers, paths, rocks, large dark patches or baked shadows. Upper right: seamless mature tree BARK as an unwrapped flat surface, vertically flowing slender irregular fissures, warm muted grey-brown ridges, tiny moss flecks; moderate detail, no harsh black cracks or knot silhouettes. Lower left: seamless flat sage green LEAF SURFACE material, delicate secondary veins with fine natural green gradients, tiny hand-placed pixels, no individual whole leaf shapes or outlines; suitable for applying to curved sculpted leaves. Lower right: seamless ivory flower PETAL SURFACE, delicate radial-ish fine fiber striations and restrained buttery cream shading, very subtle soft pink undertone, no flower silhouette or flower center; suitable for tinting different flower petals. Physically believable subtle surface detail. Flat diffuse color only: no directional specular glints, no highlights baked like 3D lights, no outlines, no objects, no words or watermarks. Make the fine organic materials elegant and beautiful at game scale.
