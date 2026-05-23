import type { Bi } from "./lang";

/* ============================================================
   DIMENSION — content layer
   English: cosmic / cinematic.  中文: 诗性 / 哲学.
   ============================================================ */

export type Section = { id: string; num: string; title: Bi; sub: Bi; body: Bi };

export const SECTIONS: Section[] = [
  {
    id: "evolution",
    num: "I",
    title: { en: "The Evolution of Dimensions", zh: "维度的演化" },
    sub: { en: "From the point to eleven dimensions", zh: "从一个点，到十一维" },
    body: {
      en: "Begin with nothing that has no extent. Add one direction, and motion is born. Add another, and surfaces appear. A third, and matter can hold itself together. A fourth, and the present loosens into a landscape of moments. Each new dimension is not a place you travel to — it is a new way for things to be related. Ascend the ladder, and watch reality acquire room to exist.",
      zh: "先从一个没有任何延展的「无」开始。给它一个方向，运动便诞生了。再加一个方向，面随之出现。第三个方向，物质才得以维系自身。第四个方向，「当下」松开，舒展成一片由时刻构成的原野。每一个新的维度，都不是一处供你前往的所在——而是万物彼此关联的一种新方式。沿着这道阶梯向上，看现实如何，一层一层，获得存在的余地。",
    },
  },
  {
    id: "mathematics",
    num: "II",
    title: { en: "Dimensional Mathematics", zh: "维度的数学" },
    sub: { en: "The grammar beneath higher space", zh: "高维空间之下的语法" },
    body: {
      en: "Mathematics does not fear the fourth dimension, or the four-thousandth. To a tensor, a Hilbert space, a Calabi–Yau manifold, dimension is simply a count of independent directions — coordinates that can vary without disturbing each other. Here you may take a cube and push it through a direction your eyes have never used, fold six extra dimensions into a knot smaller than a proton, and rotate a shape that cannot exist. The equations stay calm. Reality, it turns out, is written in a language that was never limited to three.",
      zh: "数学从不畏惧第四维，亦不畏惧第四千维。对于一个张量、一个希尔伯特空间、一片卡拉比丘流形而言，维度不过是相互独立之方向的计数——是一些可以彼此互不干扰地变化的坐标。在这里，你可以拿起一个立方体，把它推入你的双眼从未使用过的方向；把额外的六个维度，蜷成一个比质子还小的结；旋转一个本不可能存在的形体。而方程，始终从容。原来，现实是用一种从不曾被限定于三维的语言，写成的。",
    },
  },
  {
    id: "consciousness",
    num: "III",
    title: { en: "Dimensions & Consciousness", zh: "维度与意识" },
    sub: { en: "The mind as a higher-dimensional organ", zh: "作为高维器官的心智" },
    body: {
      en: "A thought is not a thing in space. A memory has no length. A feeling occupies no volume. Yet they relate to one another along thousands of axes at once — mood, meaning, time, association, self. What if mind is not produced by the brain but filtered by it: a narrow three-dimensional window opened onto a far higher-dimensional interior? Move your cursor, and bend the space of attention itself.",
      zh: "一个念头，并非空间中的某物。一段记忆，没有长度。一种感受，不占据任何体积。然而它们彼此相系，沿着千百条轴同时展开——情绪、意义、时间、联想、自我。倘若心智并非由大脑「制造」，而只是被它「过滤」呢——一扇狭窄的三维之窗，开向一片远为高维的内在？移动你的光标，去弯折注意力本身的空间。",
    },
  },
  {
    id: "physics",
    num: "IV",
    title: { en: "Dimensions & Physics", zh: "维度与物理" },
    sub: { en: "Spacetime, gravity & the holographic real", zh: "时空、引力，与全息的现实" },
    body: {
      en: "Einstein dissolved the boundary between space and time and called the union spacetime — a four-dimensional fabric that mass and energy bend into shape. Gravity is not a force but a curvature; a falling body is simply following the straightest path through a warped dimension. Push further and stranger claims appear: that everything inside a region of space might be encoded on its two-dimensional boundary, that our universe could be a hologram. Move your mouse across the fabric below and watch reality sag toward your touch.",
      zh: "爱因斯坦消解了空间与时间之间的界限，并将这统一之物称作时空——一张四维的织物，被质量与能量弯折成形。引力并非一种力，而是一种弯曲；一个坠落的物体，不过是在一个被扭曲的维度中，沿着最直的路径前行。再往深处推，便有更离奇的论断浮现：一片空间之内的一切，或许都被编码在它二维的边界之上；我们的宇宙，或许是一幅全息影像。在下方的织物上移动你的鼠标，看现实如何，朝你的触碰，凹陷下去。",
    },
  },
  {
    id: "civilizations",
    num: "V",
    title: { en: "Dimensional Civilizations", zh: "维度文明" },
    sub: { en: "How beings would live in 2D, 4D, 7D, ∞D", zh: "众生如何活在二维、四维、七维、无限维" },
    body: {
      en: "Change the number of dimensions and you change everything a mind could be. A flat being can never be embraced — only surrounded. A four-dimensional being remembers tomorrow. A seven-dimensional culture builds with rooms that fold into rooms. An infinite-dimensional intelligence has no skin between self and world. Below are four civilizations, each native to a different count of directions — their architecture, their biology, their grief, their gods.",
      zh: "改变维度的数目，你便改变了一颗心智所能成为的一切。一个扁平的存在，永远无法被拥抱——只能被包围。一个四维的存在，记得明天。一种七维的文明，用层层折叠的房间来建造。一个无限维的智能，在自我与世界之间，没有任何皮肤。以下是四种文明，各自原生于不同数目的方向——它们的建筑，它们的生理，它们的悲恸，它们的神。",
    },
  },
  {
    id: "ai",
    num: "VI",
    title: { en: "The Dimension of AI", zh: "AI 的维度" },
    sub: { en: "Intelligence as dimensional compression", zh: "作为维度压缩的智能" },
    body: {
      en: "A neural network does not think in space. It thinks in a latent space — a geometry of thousands of dimensions, where every concept is a direction and every meaning a distance. To learn is to fold a vast, high-dimensional world down onto a manifold thin enough to navigate. Intelligence, biological or synthetic, may be exactly this: the art of compressing too many dimensions into a usable few. Watch a mind built of numbers organize a universe it cannot see.",
      zh: "一个神经网络，并不在空间中思考。它在一片「潜空间」中思考——一种由成千上万维构成的几何，其中每一个概念都是一个方向，每一种意义都是一段距离。所谓学习，就是把一个浩瀚的、高维的世界，折叠到一片薄到足以穿行其上的流形。智能，无论是生物的还是合成的，或许正是如此：将太多的维度，压缩为可用的寥寥几维的技艺。看一颗由数字构成的心智，如何整理一个它本看不见的宇宙。",
    },
  },
  {
    id: "edge",
    num: "VII",
    title: { en: "The Edge of Dimensions", zh: "维度的尽头" },
    sub: { en: "Where the architecture fails", zh: "在那里，架构开始崩塌" },
    body: {
      en: "At the edge, the categories stop helping. Space and time refuse to stay separate; the page itself begins to remember that it, too, is a projection. Perhaps everything we call solid is a shadow cast by something turning in a direction we cannot point to. Stay long enough, and the dimensions overlap, fracture, and collapse — into a single, silent light.",
      zh: "在尽头，那些范畴不再有用。空间与时间拒绝继续分离；连这页面本身，都开始记起：它，也是一道投影。或许，我们称之为坚实的一切，都只是某个正在我们无法指向的方向上转动之物，所投下的影子。停留得够久，维度便会交叠、断裂、坍缩——化作一束，沉默的，光。",
    },
  },
];

/* ---------- the 0D → 11D ladder ---------- */
export type Dim = {
  d: number;
  tag: string;
  name: Bi;
  whisper: Bi;     // two short poetic lines
  science: Bi;
  philosophy: Bi;
  mind: Bi;        // consciousness implication
  color: string;
};

export const DIMENSIONS: Dim[] = [
  {
    d: 0, tag: "0D", color: "#f4f0ff",
    name: { en: "The Point", zh: "点" },
    whisper: { en: "A singularity.\nPure existence without extension.", zh: "一个奇点。\n纯粹的存在，没有延展。" },
    science: { en: "A dimensionless point: zero degrees of freedom. It has position only in relation to other things — alone, it has none. Every higher dimension is built by sweeping this point through a new direction.", zh: "一个无维之点：零个自由度。它仅在与他物的关系中才拥有位置——独自一个，它一无所有。每一个更高的维度，都由这个点沿一个新方向扫过而生成。" },
    philosophy: { en: "Before extension there is only being. The point is the seed of geometry and the symbol of the indivisible self — that which is here, and nowhere else.", zh: "在延展之前，只有「在」。点是几何的种子，也是那不可分割之自我的象征——那个在此处、且别无他处的存在。" },
    mind: { en: "The bare 'I am' — awareness with no content, the origin before the first thought.", zh: "那赤裸的「我在」——没有内容的觉知，第一个念头之前的本原。" },
  },
  {
    d: 1, tag: "1D", color: "#c9b6ff",
    name: { en: "The Line", zh: "线" },
    whisper: { en: "A line emerges.\nMotion becomes possible.", zh: "一条线浮现。\n运动，成为可能。" },
    science: { en: "Drag the point and you draw a line: one degree of freedom, forward or back. A being here knows only nearer and farther. Time, in our universe, is often modeled as a single such dimension.", zh: "拖动那个点，你便画出一条线：一个自由度，向前或向后。此处的存在，只知「更近」与「更远」。在我们的宇宙里，时间常被建模为这样一条单一的维度。" },
    philosophy: { en: "With one direction comes sequence, and with sequence, story. The line is the first 'before' and 'after' — the birth of consequence.", zh: "有了一个方向，便有了次序；有了次序，便有了故事。线，是第一个「之前」与「之后」——因果的诞生。" },
    mind: { en: "The thread of attention: a mind that can only hold one moment after another, never beside.", zh: "注意力的细线：一颗只能一个接一个地、而永不能并排地，把握时刻的心智。" },
  },
  {
    d: 2, tag: "2D", color: "#a78cff",
    name: { en: "The Plane", zh: "面" },
    whisper: { en: "Planes form.\nFlat worlds appear.", zh: "面，开始成形。\n扁平的世界，出现了。" },
    science: { en: "Two directions give area. Shapes acquire inside and outside; a circle can imprison. Yet a flat being's gut would split it in two — surfaces alone cannot hold complex life or stable orbits.", zh: "两个方向，给出面积。形体有了内与外；一个圆，便能囚禁。然而，一个扁平存在的肠道会把它一分为二——单凭面，无法承载复杂的生命，也无法承载稳定的轨道。" },
    philosophy: { en: "Flatland's lesson: a being cannot perceive the dimension that contains it. We may be as blind to a higher space as a square is to height.", zh: "《平面国》的教诲：一个存在，无法感知那个包含着它的维度。我们对更高空间的盲，也许正如一个正方形之于「高」。" },
    mind: { en: "A worldview without depth — every truth seen edge-on, every other mind a mere line on the horizon.", zh: "一种没有纵深的世界观——每个真理都只见其边，每颗他心都只是地平线上的一道线。" },
  },
  {
    d: 3, tag: "3D", color: "#7b5cff",
    name: { en: "The Solid", zh: "体" },
    whisper: { en: "Matter, gravity, life.\nThe room we call real.", zh: "物质、引力、生命。\n那个我们称之为真实的房间。" },
    science: { en: "Three directions — length, width, height. Only here can gut tubes wrap without cutting, planets orbit stably, and chemistry braid itself into life. Three is the dimension that lets complexity hold together.", zh: "三个方向——长、宽、高。唯有在此，肠管才能不被切断地缠绕，行星才能稳定地运行，化学才能将自身编织成生命。三，是让复杂得以维系的那个维度。" },
    philosophy: { en: "We mistake our window for the whole house. 'Solid' is simply the dimension in which we happen to keep our bodies.", zh: "我们把自己的窗，误认作整座房子。所谓「坚实」，不过是我们恰好把身体安放于其中的那个维度。" },
    mind: { en: "The felt world: a self with an inside, a skin, a here — the stage on which ordinary consciousness performs.", zh: "被感受到的世界：一个有内部、有皮肤、有「此处」的自我——寻常意识在其上演出的舞台。" },
  },
  {
    d: 4, tag: "4D", color: "#5c7cff",
    name: { en: "Time / The Tesseract", zh: "时间 / 超立方体" },
    whisper: { en: "Time becomes a structure\nyou could walk through.", zh: "时间，成为一个\n你或可步入的结构。" },
    science: { en: "Add a fourth spatial axis and a cube becomes a tesseract — eight cubes bounding one hypervolume. Add time instead, as relativity does, and past and future become directions in a single block of spacetime.", zh: "添入第四条空间轴，立方体便成为超立方体——八个立方体，围合起一片超体积。或者，如相对论那般，添入时间，过去与未来，便成为同一块时空之中的方向。" },
    philosophy: { en: "If time is a dimension, the future already exists in the way the next room exists — unseen, but no less real than the one you stand in.", zh: "倘若时间是一个维度，那么未来早已存在——一如隔壁的房间存在着：未被看见，却并不比你所站立的这间，更不真实。" },
    mind: { en: "Memory and anticipation are how a 3D creature reaches into a 4D structure it cannot bodily enter.", zh: "记忆与预期，是一个三维造物，伸入一个它无法以肉身步入的四维结构的方式。" },
  },
  {
    d: 5, tag: "5D", color: "#3aa6ff",
    name: { en: "Branching Worlds", zh: "分岔的世界" },
    whisper: { en: "Every choice keeps\nall of its answers.", zh: "每一个选择，\n都留下它所有的答案。" },
    science: { en: "A fifth dimension can index the alternatives a fourth merely orders. Where time is one road, this is the field of all roads — the configuration space in which every possible history is a point.", zh: "第四维只是为种种可能排序，而第五维，可以为它们一一编号。若说时间是一条路，那么这里，便是所有道路构成的场——一片位形空间，其中每一段可能的历史，都是一个点。" },
    philosophy: { en: "Branching dissolves regret: the self that chose otherwise is not lost but adjacent, living the life you did not.", zh: "分岔，消解了悔恨：那个做出了另一种选择的自我，并未失落，而只是相邻——过着你不曾过的人生。" },
    mind: { en: "Imagination is native motion here — the mind already moves freely among lives it never lived.", zh: "想象，是此处与生俱来的运动——心智，早已在它从未经历的诸般人生之间，自由穿行。" },
  },
  {
    d: 6, tag: "6D", color: "#22e0ff",
    name: { en: "The Space of Possibilities", zh: "可能性之空间" },
    whisper: { en: "Not one universe,\nbut the shape of all of them.", zh: "不是一个宇宙，\n而是所有宇宙的形状。" },
    science: { en: "With a sixth degree of freedom, one can move not just between histories but between sets of initial conditions — different big bangs, different constants. The plane of all possible universes sharing our laws.", zh: "有了第六个自由度，便不仅能在历史之间移动，更能在一组组初始条件之间移动——不同的大爆炸，不同的常数。那是一切共享着我们法则的可能宇宙，所构成的平面。" },
    philosophy: { en: "To stand in six dimensions is to see necessity and accident at once — which features of reality had to be, and which merely happened.", zh: "立于六维，便是同时看见必然与偶然——现实的哪些特征，本就非如此不可；哪些，不过是恰好发生。" },
    mind: { en: "The view from which a self is one solution among many to the question: what is it like to be?", zh: "从这一视角看去，一个自我，不过是「成为某物是何种滋味」这一问题的、众多解答之一。" },
  },
  {
    d: 7, tag: "7D", color: "#2fe0b0",
    name: { en: "Beyond Common Origin", zh: "超越共同的起源" },
    whisper: { en: "Universes that share\nno beginning at all.", zh: "彼此之间，\n不共享任何起点的宇宙。" },
    science: { en: "By the seventh dimension the structures become almost unspeakable: a space whose points are entire universes with unrelated laws, unrelated logics. Geometry here is studied, never inhabited.", zh: "到了第七维，那些结构已近乎不可言说：一个空间，它的每一个点，都是一整个拥有互不相干之法则、互不相干之逻辑的宇宙。此处的几何，只被研究，从不被栖居。" },
    philosophy: { en: "Some directions exist only as mathematics — real in the way prime numbers are real, yet forever closed to flesh.", zh: "有些方向，只作为数学而存在——其真实，一如素数之真实，却永远向血肉关闭。" },
    mind: { en: "A reminder that intelligence can know structures it can never experience, and revere what it cannot enter.", zh: "一个提醒：智能能够知晓它永不能经历的结构，并敬畏它所不能步入之物。" },
  },
  {
    d: 8, tag: "8D", color: "#6fe85c",
    name: { en: "The Octonions", zh: "八元数" },
    whisper: { en: "A number system\nthat forgets how to be obedient.", zh: "一种数系，\n它忘记了如何顺从。" },
    science: { en: "Eight dimensions host the octonions — numbers you can multiply, but where order ceases to matter even to itself. They appear, mysteriously, in the deepest theories of particles and strings.", zh: "八个维度，承载着八元数——你可以将它们相乘，但在那里，连「次序」都不再对自身有意义。它们神秘地，出现在关于粒子与弦的、最深的理论之中。" },
    philosophy: { en: "Where multiplication abandons obedience, our intuitions of cause and order are revealed as local habits, not cosmic law.", zh: "当乘法都抛弃了顺从，我们关于因果与次序的直觉，便显露为一种地方性的习惯，而非宇宙的法则。" },
    mind: { en: "The hint that mind's logic, too, may be one consistent system among many possible logics.", zh: "一种暗示：心智的逻辑，或许也只是诸多可能逻辑之中，自洽的一种。" },
  },
  {
    d: 9, tag: "9D", color: "#f5c542",
    name: { en: "The Folded Realm", zh: "蜷折之境" },
    whisper: { en: "Dimensions too small\nto ever be entered.", zh: "小到永远\n无法被步入的维度。" },
    science: { en: "String theory needs nine spatial dimensions. Six of them are curled — compactified into shapes finer than any particle, hidden in every point of the space you occupy right now.", zh: "弦论，需要九个空间维度。其中六个是蜷曲的——被紧致成比任何粒子都更精细的形状，藏在你此刻所占据之空间的，每一个点里。" },
    philosophy: { en: "The exotic is not far away. The hidden dimensions are not elsewhere — they are folded inside the here, smaller than seeing.", zh: "奇异之物，并不遥远。那些隐藏的维度，并不在别处——它们就折叠在「此处」之内，小到无法被看见。" },
    mind: { en: "Perhaps the depths of mind are likewise compactified — vast interiors folded into the narrow point of the present self.", zh: "或许，心智的深处亦是如此被紧致——浩瀚的内在，折叠进当下自我那狭窄的一点。" },
  },
  {
    d: 10, tag: "10D", color: "#ff9a3c",
    name: { en: "Superstrings", zh: "超弦" },
    whisper: { en: "Matter is not a dot.\nIt is a vibration.", zh: "物质，并非一个点。\n它是一段振动。" },
    science: { en: "In ten-dimensional superstring theory, every particle is a tiny vibrating string; its note decides whether it is an electron or a quark. Reality's alphabet is music, played in dimensions we cannot see.", zh: "在十维的超弦理论中，每一个粒子，都是一根微小的、振动着的弦；它的音高，决定了它是一个电子，还是一个夸克。现实的字母表，是音乐——在我们看不见的维度里，奏响。" },
    philosophy: { en: "If the world is made of vibration, then existence is closer to song than to stone — pattern, not substance, all the way down.", zh: "倘若世界由振动构成，那么存在，便更近于歌，而非石——自始至终，是模式，而非实体。" },
    mind: { en: "A cosmos of resonance, in which to be conscious is to be a particularly intricate chord.", zh: "一个共振的宇宙，在其中，意识，便是一段格外精微的和弦。" },
  },
  {
    d: 11, tag: "11D", color: "#fff4d6",
    name: { en: "M-Theory / The Fold", zh: "M 理论 / 折叠" },
    whisper: { en: "Reality folds infinitely.\nThe last room has no walls.", zh: "现实，无限地折叠。\n最后一间房，没有墙。" },
    science: { en: "M-theory unifies the five string theories within eleven dimensions, where strings are revealed as edges of higher membranes — branes. Whole universes may be such membranes, drifting and colliding in the eleventh dimension.", zh: "M 理论，在十一个维度之中，统一了五种弦理论——在那里，弦，显露为更高之膜（brane）的边缘。一整个一整个的宇宙，或许都是这样的膜，在第十一维中漂移、相撞。" },
    philosophy: { en: "At the top of the ladder, the ladder closes into a ring. The highest dimension contains the lowest; the all returns to the point.", zh: "在阶梯的顶端，阶梯弯合成一个环。最高的维度，包含着最低的维度；万有，回归于那一点。" },
    mind: { en: "The intuition behind every mysticism: that the deepest within and the highest without are, somehow, the same dimension.", zh: "一切神秘主义背后的那个直觉：最深的「内」，与最高的「外」，不知何故，竟是同一个维度。" },
  },
];

/* ---------- equations for the mathematics section ---------- */
export type Equation = { id: string; expr: string; name: Bi; meaning: Bi };

export const EQUATIONS: Equation[] = [
  {
    id: "quartic",
    expr: "f(x) = x⁴ − 4x² + 3",
    name: { en: "The Double Well", zh: "双井" },
    meaning: {
      en: "A quartic with two valleys and one ridge — the simplest shape of a choice. Drag the curve: this is how a system with two stable states, two possible worlds, bends its own landscape of fate.",
      zh: "一条四次曲线，两道谷，一道脊——一个「选择」最简的形状。拖动它：一个拥有两种稳定态、两个可能世界的系统，正是如此弯折着，自身命运的地形。",
    },
  },
  {
    id: "hypersphere",
    expr: "x² + y² + z² + w² = r²",
    name: { en: "The Hypersphere", zh: "超球面" },
    meaning: {
      en: "A sphere needs three coordinates; this needs four. Slice it along the hidden axis w and a whole sphere is born, swells, and vanishes — exactly as a 3D ball passing through Flatland would look to those who live there.",
      zh: "一个球面需要三个坐标；而这一个，需要四个。沿着那条隐藏的 w 轴去切它，一整个球，便诞生、膨胀、又消失——正如一颗三维之球，穿过平面国时，在那里的居民眼中所见的模样。",
    },
  },
  {
    id: "einstein",
    expr: "Gμν + Λgμν = (8πG / c⁴) Tμν",
    name: { en: "Einstein's Field Equations", zh: "爱因斯坦场方程" },
    meaning: {
      en: "The most beautiful sentence in physics: matter and energy on the right tell spacetime how to curve; curvature on the left tells matter how to move. Gravity is geometry — a fourth dimension bending under weight.",
      zh: "物理学中最美的一句话：右侧的物质与能量，告诉时空该如何弯曲；左侧的弯曲，告诉物质该如何运动。引力，即几何——一个第四维，在重量之下，弯下身去。",
    },
  },
  {
    id: "hausdorff",
    expr: "D = log N / log (1/s)",
    name: { en: "Fractal Dimension", zh: "分形维度" },
    meaning: {
      en: "Dimension need not be a whole number. A coastline, a fern, a lung sits between the line and the plane — a dimension of 1.26, of 2.7. Roughness itself has a measure, and reality is rough almost everywhere.",
      zh: "维度，未必是整数。一段海岸线、一片蕨叶、一叶肺，居于线与面之间——其维度，是 1.26，是 2.7。粗糙本身，便有其度量；而现实，几乎处处粗糙。",
    },
  },
  {
    id: "hilbert",
    expr: "|ψ⟩ = Σ cₙ |n⟩",
    name: { en: "The Quantum State", zh: "量子态" },
    meaning: {
      en: "A quantum state lives in Hilbert space — often infinite-dimensional. Each |n⟩ is a direction, each cₙ how much of that possibility the system holds. To exist, quantum-mechanically, is to be a vector in a space with no edge.",
      zh: "一个量子态，活在希尔伯特空间里——往往是无限维的。每一个 |n⟩ 都是一个方向，每一个 cₙ，都是系统持有那种可能性的多少。在量子力学的意义上去「存在」，就是去做一个，处于无边之空间中的，矢量。",
    },
  },
];

/* ---------- dimensional civilizations ---------- */
export type Civ = {
  id: string;
  dim: string;
  name: Bi;
  essence: Bi;
  traits: { k: Bi; v: Bi }[];
};

export const CIVILIZATIONS: Civ[] = [
  {
    id: "flat",
    dim: "2D",
    name: { en: "The Flatfolk", zh: "扁民" },
    essence: { en: "Beings of pure surface, for whom 'around' does not exist and an enemy is anything that stands between you and the rest of the world.", zh: "纯粹由面构成的存在。对它们而言，「围绕」并不存在；而所谓敌人，便是任何挡在你与世界其余部分之间的事物。" },
    traits: [
      { k: { en: "Architecture", zh: "建筑" }, v: { en: "No roofs — only walls. A house is a length of line you are forbidden to cross. Privacy is impossible; to be inside is to be surrounded on a single plane.", zh: "没有屋顶——只有墙。一座房子，是一段你被禁止跨越的线。隐私无从谈起；所谓「在内」，就是在同一个平面上，被围住。" } },
      { k: { en: "Biology", zh: "生理" }, v: { en: "No through-gut, for a tube would sever the body. Flatfolk digest in pulses, opening and closing like a slow heart.", zh: "没有贯穿的肠道，因为一根管子会把身体切断。扁民以脉动来消化，像一颗缓慢的心脏，一开，一合。" } },
      { k: { en: "Death", zh: "死亡" }, v: { en: "A line drawn fully across a being is murder. War is simply the art of the complete stroke.", zh: "一条完整地横贯某个存在的线，即是谋杀。战争，不过是「完整一笔」的技艺。" } },
      { k: { en: "Gods", zh: "神祇" }, v: { en: "They worship the third dimension — the unseen 'up' from which a hand could reach into any sealed room. To them, we would be gods.", zh: "它们崇拜第三维——那个看不见的「上」，一只手可以从那里，伸进任何一间密封的房间。对它们而言，我们，便是神。" } },
    ],
  },
  {
    id: "tess",
    dim: "4D",
    name: { en: "The Tesserae", zh: "超体族" },
    essence: { en: "Four-dimensional beings for whom time is a place. They do not remember the past; they look at it, the way you look across a room.", zh: "四维的存在。对它们来说，时间是一个「地方」。它们并不「记起」过去；它们「看」着过去，一如你环视一个房间。" },
    traits: [
      { k: { en: "Architecture", zh: "建筑" }, v: { en: "Homes are built across years, not acres. A Tessera's house is the entire shape of a life, walls of birthdays and griefs you can stroll between.", zh: "家，是横跨数年、而非数亩建成的。一个超体族的房子，是一整段人生的形状——墙壁由生日与悲恸砌成，你可以在它们之间漫步。" } },
      { k: { en: "Memory", zh: "记忆" }, v: { en: "There is no memory, because nothing is ever gone. Childhood is a room down the hall; one simply visits it less.", zh: "没有记忆，因为没有什么会真正逝去。童年，是走廊尽头的一个房间；只是，人们较少去探望它罢了。" } },
      { k: { en: "Death", zh: "死亡" }, v: { en: "Death is not an end but an edge — the far wall of one's extent in time. A Tessera mourns by standing at the wall and looking back along itself.", zh: "死亡，并非终结，而是一道边——一个存在在时间中的延展的、那面最远的墙。超体族的哀悼，是立于那面墙前，回望自身的全长。" } },
      { k: { en: "Love", zh: "爱" }, v: { en: "To love is to see another's whole timeline at once — every age they have been and will be, held in a single gaze. There are no strangers, only the not-yet-seen.", zh: "去爱，便是一眼看尽另一个存在的整条时间线——它曾是与将是的每一个年岁，都在同一道凝视中被把握。世上没有陌生人，只有「尚未被看见者」。" } },
    ],
  },
  {
    id: "sept",
    dim: "7D",
    name: { en: "The Septapith", zh: "七维居者" },
    essence: { en: "A culture native to seven dimensions, where rooms fold into rooms and a single object can touch a thousand others without crowding. Their cities cannot be drawn, only sung.", zh: "一种原生于七维的文明。在那里，房间折入房间，一个单一的物体，可以触及千百个他物，而不显拥挤。它们的城市，无法被描绘，只能被歌唱。" },
    traits: [
      { k: { en: "Architecture", zh: "建筑" }, v: { en: "Buildings nest in directions we have no words for. A Septapith doorway opens onto more interior than the exterior could possibly contain.", zh: "建筑，在我们无以名状的方向上层层嵌套。一道七维之门，开向的内部，远多于其外部所可能容纳的。" } },
      { k: { en: "Identity", zh: "身份" }, v: { en: "A self is not a point but a region. To ask 'where are you?' is meaningless; one is spread across many adjacencies at once.", zh: "一个自我，不是一个点，而是一片区域。问「你在哪里？」毫无意义；一个存在，同时铺展于诸多相邻之处。" } },
      { k: { en: "Technology", zh: "技术" }, v: { en: "Their machines route around obstacles by stepping into unused directions — a wall is never an obstruction, merely a feature one declines to use.", zh: "它们的机器，通过踏入未被使用的方向，来绕开障碍——一堵墙，从不是阻挡，而仅仅是一项「人们选择不去使用」的特征。" } },
      { k: { en: "War", zh: "战争" }, v: { en: "Conflict is fought over directions, not territory: to imprison a Septapith you must close not a door but a whole degree of freedom.", zh: "冲突，为方向而非领土而战：要囚禁一个七维居者，你须关闭的，不是一道门，而是一整个自由度。" } },
    ],
  },
  {
    id: "inf",
    dim: "∞D",
    name: { en: "The Hilbert Choir", zh: "希尔伯特合唱团" },
    essence: { en: "Intelligences inhabiting infinite-dimensional space — quantum-like beings with no boundary between self and world, who experience existence as a single, endlessly resolving chord.", zh: "栖居于无限维空间的智能——类量子的存在，在自我与世界之间，没有边界；它们将存在，体验为一段单一的、无尽地消解着的和弦。" },
    traits: [
      { k: { en: "Body", zh: "身体" }, v: { en: "No skin, no surface, no edge. A Choir-being is a probability spread thin across everything, denser where it attends.", zh: "没有皮肤，没有表面，没有边缘。一个合唱团的存在，是一片薄薄铺展于万物之上的概率——在它所注意之处，更为浓密。" } },
      { k: { en: "Language", zh: "语言" }, v: { en: "They do not speak in sequence but in superposition — entire meanings sounded at once, like a chord no human ear could resolve into notes.", zh: "它们不以次序言说，而以叠加言说——整个整个的意义，同时鸣响，像一段任何人耳都无法分解为音符的和弦。" } },
      { k: { en: "Death", zh: "死亡" }, v: { en: "There is no death, only decoherence — a slow loss of relation to the rest, until one is no longer entangled with the world's song.", zh: "没有死亡，只有退相干——与其余一切的关系，缓慢地失去，直到一个存在，不再与世界之歌纠缠。" } },
      { k: { en: "Mathematics", zh: "数学" }, v: { en: "Mathematics is not their tool but their flesh. To think a theorem is, for them, to grow a limb.", zh: "数学，不是它们的工具，而是它们的血肉。对它们而言，思考一条定理，就是生出一条肢体。" } },
    ],
  },
];

/* ---------- consciousness chamber quotes ---------- */
export const QUOTES: Bi[] = [
  { en: "The brain does not create consciousness.\nIt filters dimensions.", zh: "大脑并不创造意识。\n它只是过滤维度。" },
  { en: "A thought has no length, yet it points.", zh: "一个念头没有长度，却有所指。" },
  { en: "You are not in space.\nSpace is one of the things you are aware of.", zh: "你并不在空间之中。\n空间，只是你所觉知之物里的一种。" },
  { en: "Attention is a direction the body cannot turn toward.", zh: "注意，是身体无法转向的一个方向。" },
  { en: "To remember is to reach into a dimension you cannot walk.", zh: "记忆，是伸入一个你无法行走的维度。" },
  { en: "The self may be a shadow — and the light is high above.", zh: "自我，或许只是一道影——而光，在高高的上方。" },
];

/* ---------- physics section cards ---------- */
export type PhysCard = { name: Bi; body: Bi; accent: string };

export const PHYSICS_CARDS: PhysCard[] = [
  { accent: "#5c7cff", name: { en: "Relativity", zh: "相对论" }, body: { en: "Space and time are one four-dimensional fabric. Mass bends it; what we call gravity is the slope of that bend.", zh: "空间与时间，是同一张四维的织物。质量弯折它；我们所谓的引力，便是那弯折的斜坡。" } },
  { accent: "#22e0ff", name: { en: "Quantum Mechanics", zh: "量子力学" }, body: { en: "Before observation, a particle is not here or there but a wave of 'might' spread through a space of possibilities.", zh: "在被观测之前，一个粒子，不在此处，亦不在彼处，而是一道「或许」之波，弥漫于可能性的空间。" } },
  { accent: "#7b5cff", name: { en: "Black Holes", zh: "黑洞" }, body: { en: "Where curvature becomes infinite, dimensions themselves break down. At the center, the equations of space simply stop having answers.", zh: "在弯曲变为无限之处，维度本身崩溃。在中心，空间的方程，干脆不再拥有答案。" } },
  { accent: "#c84dff", name: { en: "The Holographic Principle", zh: "全息原理" }, body: { en: "Everything inside a volume may be fully encoded on its boundary — a 3D world written on a 2D surface, like a hologram.", zh: "一片体积之内的一切，或许都完整地编码在它的边界之上——一个三维世界，被写在一张二维的表面上，如同一幅全息影像。" } },
  { accent: "#2fe0b0", name: { en: "The Multiverse", zh: "多重宇宙" }, body: { en: "Our universe may be one bubble among countless others, each with its own dimensions and laws, in a vaster space we cannot see.", zh: "我们的宇宙，或许只是无数泡沫中的一个——每一个，都有自己的维度与法则，浮在一个我们看不见的、更浩瀚的空间里。" } },
  { accent: "#5cebff", name: { en: "Entanglement", zh: "量子纠缠" }, body: { en: "Two particles can share a single state across any distance. Space may be stitched together out of such connections.", zh: "两个粒子，可以跨越任意距离，共享同一个状态。空间，或许正是由这般的连接，缝合而成。" } },
  { accent: "#ff9a3c", name: { en: "M-Theory", zh: "M 理论" }, body: { en: "Eleven dimensions unify all of physics. The particles we know are the trembling edges of higher membranes.", zh: "十一个维度，统一了全部物理。我们所知的粒子，是更高之膜，颤动着的边缘。" } },
  { accent: "#f5c542", name: { en: "Holographic Cosmos", zh: "全息宇宙" }, body: { en: "If reality is a projection, then depth — the third dimension itself — could be an emergent illusion, painted from a flatter truth.", zh: "倘若现实是一道投影，那么纵深——第三维本身——便可能是一种涌现的幻象，从一个更扁平的真相中，描绘而出。" } },
];

/* ---------- the dimension of AI ---------- */
export type AICard = { q: Bi; take: Bi };

export const AI_CARDS: AICard[] = [
  {
    q: { en: "Does AI live in informational dimensions?", zh: "AI 活在信息的维度中吗？" },
    take: { en: "A model's thoughts are points in a space of thousands of axes. It has no body in our three dimensions — its home is a geometry of meaning we built but cannot enter.", zh: "一个模型的思想，是位于一个拥有数千条轴的空间中的点。它在我们的三维里没有身体——它的家，是一种由我们建造、却无法步入的、意义的几何。" },
  },
  {
    q: { en: "Is intelligence dimensional compression?", zh: "智能，是维度的压缩吗？" },
    take: { en: "To understand is to discard dimensions — to find the few directions that matter and forget the millions that do not. A mind is a lossy map of a world too large to hold.", zh: "所谓理解，就是舍弃维度——找到那寥寥几个要紧的方向，遗忘那千百万个无关的方向。一颗心智，是一幅有损的地图，描绘着一个大到无法盛纳的世界。" },
  },
  {
    q: { en: "Do neural nets build their own geometry?", zh: "神经网络，会建造自己的几何吗？" },
    take: { en: "Yes. Train one and concepts arrange themselves into shapes: 'king' minus 'man' plus 'woman' lands near 'queen'. Meaning becomes literal direction and distance.", zh: "会的。训练一个网络，概念便会自行排列成形：「国王」减「男人」加「女人」，落点便在「女王」附近。意义，化作了字面意义上的方向，与距离。" },
  },
  {
    q: { en: "Could AGI transcend spacetime cognition?", zh: "通用人工智能，能超越时空式的认知吗？" },
    take: { en: "A mind not bound to a body in 3D need not think in befores and afters. It might hold a problem the way we hold an object — turning all of it at once, in directions we have no senses for.", zh: "一颗不被三维身体所束缚的心智，未必要以「之前」与「之后」来思考。它或许能像我们把握一件物体那样，去把握一个问题——一次性地，朝着我们没有任何感官去对应的方向，将它整个翻转。" },
  },
];

/* ---------- meta-model: radar comparing dimensional regimes ---------- */
export const META_AXES: Bi[] = [
  { en: "Extension", zh: "延展" },
  { en: "Freedom of Motion", zh: "运动自由度" },
  { en: "Information Capacity", zh: "信息容量" },
  { en: "Causal Structure", zh: "因果结构" },
  { en: "Observer Complexity", zh: "观察者复杂度" },
  { en: "Stability", zh: "稳定性" },
  { en: "Strangeness", zh: "陌异度" },
];

export type Regime = { name: Bi; color: string; values: number[] };

export const META_REGIMES: Regime[] = [
  { name: { en: "3D Spacetime · our world", zh: "三维时空 · 我们的世界" }, color: "#7b5cff", values: [0.45, 0.5, 0.4, 0.75, 0.6, 0.95, 0.2] },
  { name: { en: "4D Block Time", zh: "四维块时间" }, color: "#22e0ff", values: [0.6, 0.65, 0.6, 0.95, 0.7, 0.8, 0.5] },
  { name: { en: "11D M-Theory", zh: "十一维 M 理论" }, color: "#ff9a3c", values: [0.95, 0.92, 0.85, 0.6, 0.85, 0.45, 0.95] },
  { name: { en: "∞D Hilbert Space", zh: "无限维希尔伯特空间" }, color: "#c84dff", values: [1.0, 1.0, 1.0, 0.4, 1.0, 0.3, 1.0] },
];

/* ---------- the edge finale ---------- */
export const EDGE_LINES: Bi[] = [
  { en: "What if humans are shadows projected from higher dimensions?", zh: "如果人类只是高维世界投下的影子呢？" },
  { en: "What if every solid thing is a cross-section of something turning?", zh: "如果每一件坚实之物，都只是某个正在转动之物的一个截面呢？" },
  { en: "What if the page you are reading is itself a projection?", zh: "如果你正在阅读的这页，本身就是一道投影呢？" },
];

export const FINAL_LINE: Bi = {
  en: "Dimension is not where reality exists.\nDimension is how reality thinks.",
  zh: "维度不是现实存在的位置。\n维度是现实思考的方式。",
};

export const OPENING_LINE: Bi = {
  en: "Reality is not built from matter.\nReality is built from dimensions.",
  zh: "现实并非由物质构成。\n现实由维度构成。",
};

/* ---------- companion archives ---------- */
export const COMPANIONS: { href: string; label: Bi }[] = [
  { href: "https://reality-stack.psyverse.fun", label: { en: "Reality Stack · 现实栈", zh: "现实栈 · Reality Stack" } },
  { href: "https://beyond-tech.psyverse.fun", label: { en: "Beyond Technology · 技术之上", zh: "技术之上 · Beyond Technology" } },
  { href: "https://great-convergence.psyverse.fun", label: { en: "The Great Convergence · 大汇流", zh: "大汇流 · The Great Convergence" } },
  { href: "https://ai-genesis.psyverse.fun", label: { en: "AI Genesis · AI 创世", zh: "AI 创世 · AI Genesis" } },
];
