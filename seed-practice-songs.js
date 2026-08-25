const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const admin = await db.collection("users").findOne({ role: "admin" });
  const adminId = admin?._id?.toString() || "69dfac0adb8037a014ca9178";

  const matiere = await db.collection("matieres").findOne({ code: "AN-AD" });
  if (!matiere) { console.log("❌ Matière AN-AD non trouvée"); await mongoose.disconnect(); return; }
  const matId = matiere._id.toString();
  const matiereId = new mongoose.Types.ObjectId(matId);

  const lastChap = await db.collection("chapitres").find({ matiereId: matiereId, niveau: "Adulte" }).sort({ ordre: -1 }).limit(1).toArray();
  let ordreStart = lastChap.length > 0 ? (lastChap[0].ordre || 0) + 1 : 1;

  // Nettoyer anciens chapitres chansons
  const oldToClean = await db.collection("chapitres").find({
    matiereId: matiereId, niveau: "Adulte",
    titre: { $regex: /^P\d+\s*—\s*Practice : Chanson/i }
  }).toArray();
  for (const c of oldToClean) {
    await db.collection("lecons").deleteMany({ chapitreId: c._id });
    await db.collection("chapitres").deleteOne({ _id: c._id });
  }
  console.log(`🧹 ${oldToClean.length} anciennes chansons nettoyées`);

  async function addChapitre(titre, objectif, contenuHTML, ordre) {
    const chap = await db.collection("chapitres").insertOne({
      matiereId: matiereId, titre, niveau: "Adulte", objectif, ordre, actif: true,
      createdAt: new Date(), updatedAt: new Date()
    });
    await db.collection("lecons").insertOne({
      chapitreId: chap.insertedId, titre, matiere: matId, classe: "Adulte", statut: "publie",
      masque: false, creePar: adminId, contenuHTML, contenuBrut: "",
      dureeExercices: 20,
      contenuFormate: { correctionsTypes: [], exercices: [] },
      createdAt: new Date(), updatedAt: new Date()
    });
    console.log(`  🎵 ${titre}`);
    return chap.insertedId;
  }

  // ═══════════════════════════════════════════════════════
  //  PRACTICE — 10 CHANSONS AVEC TRADUCTION PHRASE PAR PHRASE
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "P11 — Practice : Chanson — Perfect (Ed Sheeran)",
    "Apprendre l'anglais avec une chanson d'amour douce et romantique",
    `<div class="lecon-anglais">
<h1>🎵 P11 — Perfect — Ed Sheeran</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Thème :</strong> Amour, romance<br/>
<strong>Pourquoi cette chanson ?</strong> Paroles claires, lent, parfait pour débutantes. Vocabulaire d'amour simple.</p>
</div>

<h2>🎥 Vidéo Officielle</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/2Vv-BfVoq4g" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles + Traduction phrase par phrase</h2>
<div class="dialogue-box">
  <p><strong>I found a love for me</strong><br/><em>J'ai trouvé un amour pour moi</em></p>
  <p><strong>Darling, just dive right in and follow my lead</strong><br/><em>Chéri, plonge tout de suite et suis mon exemple</em></p>
  <p><strong>Well, I found a girl, beautiful and sweet</strong><br/><em>Eh bien, j'ai trouvé une fille, belle et douce</em></p>
  <p><strong>I never knew you were the someone waiting for me</strong><br/><em>Je ne savais jamais que tu étais celle qui m'attendait</em></p>
  <br/>
  <p><strong>'Cause we were just kids when we fell in love</strong><br/><em>Parce que nous n'étions que des enfants quand nous sommes tombés amoureux</em></p>
  <p><strong>Not knowing what it was</strong><br/><em>Ne sachant pas ce que c'était</em></p>
  <p><strong>I will not give you up this time</strong><br/><em>Je ne te laisserai pas partir cette fois</em></p>
  <p><strong>But darling, just kiss me slow, your heart is all I own</strong><br/><em>Mais chéri, embrasse-moi doucement, ton cœur est tout ce que je possède</em></p>
  <p><strong>And in your eyes you're holding mine</strong><br/><em>Et dans tes yeux tu retiens les miens</em></p>
  <br/>
  <p><strong>Baby, I'm dancing in the dark with you between my arms</strong><br/><em>Bébé, je danse dans le noir avec toi entre mes bras</em></p>
  <p><strong>Barefoot on the grass, listening to our favourite song</strong><br/><em>Pieds nus dans l'herbe, en écoutant notre chanson préférée</em></p>
  <p><strong>When you said you looked a mess, I whispered underneath my breath</strong><br/><em>Quand tu as dit que tu étais en désordre, j'ai murmuré sous mon souffle</em></p>
  <p><strong>But you heard it, darling, you look perfect tonight</strong><br/><em>Mais tu l'as entendu, chéri, tu es parfaite ce soir</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Darling</td><td>Chéri(e)</td></tr>
<tr><td>Dive in</td><td>Plonger</td></tr>
<tr><td>Fall in love</td><td>Tomber amoureux</td></tr>
<tr><td>Barefoot</td><td>Pieds nus</td></tr>
<tr><td>Whisper</td><td>Murmurer</td></tr>
<tr><td>Perfect</td><td>Parfait(e)</td></tr>
<tr><td>Favourite</td><td>Préféré(e)</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Écoutez la chanson 3 fois. 1ère fois : suivez les paroles. 2ème fois : chantez doucement. 3ème fois : chantez sans regarder !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P12 — Practice : Chanson — Hello (Adele)",
    "Apprendre l'anglais avec une chanson émouvante et facile à suivre",
    `<div class="lecon-anglais">
<h1>🎵 P12 — Hello — Adele</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Thème :</strong> Regrets, souvenirs, appel à un ancien amour<br/>
<strong>Pourquoi cette chanson ?</strong> Adele chante lentement et clairement. Paroles simples et émouvantes.</p>
</div>

<h2>🎥 Vidéo Officielle</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/YQHsXMglC9A" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles + Traduction</h2>
<div class="dialogue-box">
  <p><strong>Hello, it's me</strong><br/><em>Bonjour, c'est moi</em></p>
  <p><strong>I was wondering if after all these years you'd like to meet</strong><br/><em>Je me demandais si après toutes ces années tu voudrais me rencontrer</em></p>
  <p><strong>To go over everything</strong><br/><em>Pour revenir sur tout</em></p>
  <p><strong>They say that time's supposed to heal ya, but I ain't done much healing</strong><br/><em>On dit que le temps est censé te guérir, mais je n'ai pas beaucoup guéri</em></p>
  <br/>
  <p><strong>Hello, can you hear me?</strong><br/><em>Bonjour, peux-tu m'entendre ?</em></p>
  <p><strong>I'm in California dreaming about who we used to be</strong><br/><em>Je suis en Californie en rêvant de ce que nous étions</em></p>
  <p><strong>When we were younger and free</strong><br/><em>Quand nous étions plus jeunes et libres</em></p>
  <p><strong>I've forgotten how it felt before the world fell at our feet</strong><br/><em>J'ai oublié ce que ça faisait avant que le monde s'effondre à nos pieds</em></p>
  <br/>
  <p><strong>Hello from the other side</strong><br/><em>Bonjour de l'autre côté</em></p>
  <p><strong>I must've called a thousand times</strong><br/><em>J'ai dû appeler mille fois</em></p>
  <p><strong>To tell you I'm sorry for everything that I've done</strong><br/><em>Pour te dire que je suis désolée pour tout ce que j'ai fait</em></p>
  <p><strong>But when I call, you never seem to be home</strong><br/><em>Mais quand j'appelle, tu ne sembles jamais être là</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Wonder</td><td>Se demander</td></tr>
<tr><td>Heal</td><td>Guérir</td></tr>
<tr><td>Dream</td><td>Rêver</td></tr>
<tr><td>Forget</td><td>Oublier</td></tr>
<tr><td>Sorry</td><td>Désolé(e)</td></tr>
<tr><td>Used to be</td><td>Étions avant</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Cette chanson est parfaite pour apprendre à dire "Bonjour", "Désolé", et "Rêver". La mélodie est lente et répétitive — facile à retenir !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P13 — Practice : Chanson — Count On Me (Bruno Mars)",
    "Apprendre l'anglais avec une chanson joyeuse sur l'amitié",
    `<div class="lecon-anglais">
<h1>🎵 P13 — Count On Me — Bruno Mars</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant total<br/>
<strong>Thème :</strong> Amitié, soutien<br/>
<strong>Pourquoi cette chanson ?</strong> Ultra-positive, paroles très simples, parfait pour commencer.</p>
</div>

<h2>🎥 Vidéo Officielle</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/6k8cpUkKK4c" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles + Traduction</h2>
<div class="dialogue-box">
  <p><strong>If you ever find yourself stuck in the middle of the sea</strong><br/><em>Si tu te retrouves un jour coincé au milieu de la mer</em></p>
  <p><strong>I'll sail the world to find you</strong><br/><em>Je naviguerai autour du monde pour te trouver</em></p>
  <p><strong>If you ever find yourself lost in the dark and you can't see</strong><br/><em>Si tu te retrouves un jour perdu dans le noir et que tu ne vois pas</em></p>
  <p><strong>I'll be the light to guide you</strong><br/><em>Je serai la lumière pour te guider</em></p>
  <br/>
  <p><strong>Find out what we're made of</strong><br/><em>Découvrons de quoi nous sommes faits</em></p>
  <p><strong>When we are called to help our friends in need</strong><br/><em>Quand on nous appelle pour aider nos amis dans le besoin</em></p>
  <br/>
  <p><strong>You can count on me like one, two, three</strong><br/><em>Tu peux compter sur moi comme un, deux, trois</em></p>
  <p><strong>And I'll be there</strong><br/><em>Et je serai là</em></p>
  <p><strong>And I know when I need it, I can count on you like four, three, two</strong><br/><em>Et je sais que quand j'en ai besoin, je peux compter sur toi comme quatre, trois, deux</em></p>
  <p><strong>And you'll be there</strong><br/><em>Et tu seras là</em></p>
  <p><strong>'Cause that's what friends are supposed to do</strong><br/><em>Parce que c'est ce que les amis sont censés faire</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Count on</td><td>Compter sur</td></tr>
<tr><td>Stuck</td><td>Coincé(e)</td></tr>
<tr><td>Sail</td><td>Naviguer</td></tr>
<tr><td>Guide</td><td>Guider</td></tr>
<tr><td>Friend</td><td>Ami(e)</td></tr>
<tr><td>Need</td><td>Besoin</td></tr>
<tr><td>Light</td><td>Lumière</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>C'est LA chanson parfaite pour débutantes. "Count on me" = compte sur moi. Apprenez-la et chantez-la à vos amies !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P14 — Practice : Chanson — Shallow (Lady Gaga & Bradley Cooper)",
    "Apprendre l'anglais avec une chanson puissante et émouvante du film A Star Is Born",
    `<div class="lecon-anglais">
<h1>🎵 P14 — Shallow — Lady Gaga & Bradley Cooper</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Intermédiaire<br/>
<strong>Thème :</strong> Amour, courage, se dépasser<br/>
<strong>Pourquoi cette chanson ?</strong> Duo magnifique, vocabulaire riche mais clair. Oscar de la meilleure chanson 2019.</p>
</div>

<h2>🎥 Vidéo (Live aux Oscars)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/BoVKSCWfiqM" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles + Traduction</h2>
<div class="dialogue-box">
  <p><strong>Tell me something, girl</strong><br/><em>Dis-moi quelque chose, fille</em></p>
  <p><strong>Are you happy in this modern world?</strong><br/><em>Es-tu heureuse dans ce monde moderne ?</em></p>
  <p><strong>Or do you need more?</strong><br/><em>Ou as-tu besoin de plus ?</em></p>
  <p><strong>Is there something else you're searching for?</strong><br/><em>Y a-t-il autre chose que tu cherches ?</em></p>
  <br/>
  <p><strong>I'm falling</strong><br/><em>Je tombe</em></p>
  <p><strong>In all the good times I find myself longing for change</strong><br/><em>Dans tous les bons moments je me surprends à désirer le changement</em></p>
  <p><strong>And in the bad times I fear myself</strong><br/><em>Et dans les mauvais moments j'ai peur de moi-même</em></p>
  <br/>
  <p><strong>Tell me something, boy</strong><br/><em>Dis-moi quelque chose, garçon</em></p>
  <p><strong>Aren't you tired trying to fill that void?</strong><br/><em>N'es-tu pas fatigué d'essayer de combler ce vide ?</em></p>
  <p><strong>Or do you need more?</strong><br/><em>Ou as-tu besoin de plus ?</em></p>
  <p><strong>Ain't it hard keeping it so hardcore?</strong><br/><em>N'est-ce pas dur de rester si dur ?</em></p>
  <br/>
  <p><strong>I'm off the deep end, watch as I dive in</strong><br/><em>Je suis au bout du gouffre, regarde comme je plonge</em></p>
  <p><strong>I'll never meet the ground</strong><br/><em>Je ne toucherai jamais le sol</em></p>
  <p><strong>Crash through the surface where they can't hurt us</strong><br/><em>Briser la surface où ils ne peuvent pas nous blesser</em></p>
  <p><strong>We're far from the shallow now</strong><br/><em>Nous sommes loin du superficiel maintenant</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Shallow</td><td>Superficiel / Peu profond</td></tr>
<tr><td>Modern world</td><td>Monde moderne</td></tr>
<tr><td>Search for</td><td>Chercher</td></tr>
<tr><td>Fall</td><td>Tomber</td></tr>
<tr><td>Fear</td><td>Avoir peur</td></tr>
<tr><td>Tired</td><td>Fatigué(e)</td></tr>
<tr><td>Crash through</td><td>Briser / Percer</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Cette chanson a gagné l'Oscar. Écoutez-la en regardant le film "A Star Is Born" — c'est encore plus émouvant !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P15 — Practice : Chanson — Yesterday (The Beatles)",
    "Apprendre l'anglais avec un classique intemporel des Beatles",
    `<div class="lecon-anglais">
<h1>🎵 P15 — Yesterday — The Beatles</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Thème :</strong> Regrets, nostalgie<br/>
<strong>Pourquoi cette chanson ?</strong> La chanson la plus reprise de tous les temps. Paroles très simples.</p>
</div>

<h2>🎥 Vidéo</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/NrgmdOz227U" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles + Traduction</h2>
<div class="dialogue-box">
  <p><strong>Yesterday, all my troubles seemed so far away</strong><br/><em>Hier, tous mes problèmes semblaient si loin</em></p>
  <p><strong>Now it looks as though they're here to stay</strong><br/><em>Maintenant on dirait qu'ils sont là pour rester</em></p>
  <p><strong>Oh, I believe in yesterday</strong><br/><em>Oh, je crois en hier</em></p>
  <br/>
  <p><strong>Suddenly, I'm not half the man I used to be</strong><br/><em>Soudain, je ne suis plus la moitié de l'homme que j'étais</em></p>
  <p><strong>There's a shadow hanging over me</strong><br/><em>Il y a une ombre au-dessus de moi</em></p>
  <p><strong>Oh, yesterday came suddenly</strong><br/><em>Oh, hier est arrivé soudainement</em></p>
  <br/>
  <p><strong>Why she had to go, I don't know, she wouldn't say</strong><br/><em>Pourquoi elle devait partir, je ne sais pas, elle ne voulait pas dire</em></p>
  <p><strong>I said something wrong, now I long for yesterday</strong><br/><em>J'ai dit quelque chose de mal, maintenant je désire hier</em></p>
  <br/>
  <p><strong>Yesterday, love was such an easy game to play</strong><br/><em>Hier, l'amour était un jeu si facile à jouer</em></p>
  <p><strong>Now I need a place to hide away</strong><br/><em>Maintenant j'ai besoin d'un endroit pour me cacher</em></p>
  <p><strong>Oh, I believe in yesterday</strong><br/><em>Oh, je crois en hier</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Yesterday</td><td>Hier</td></tr>
<tr><td>Trouble</td><td>Problème</td></tr>
<tr><td>Far away</td><td>Loin</td></tr>
<tr><td>Shadow</td><td>Ombre</td></tr>
<tr><td>Believe</td><td>Croire</td></tr>
<tr><td>Suddenly</td><td>Soudainement</td></tr>
<tr><td>Hide away</td><td>Se cacher</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>"Yesterday" est la chanson la plus simple des Beatles. Parfait pour apprendre les mots "hier", "problème", et "croire".</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P16 — Practice : Chanson — Let It Be (The Beatles)",
    "Apprendre l'anglais avec un message de paix et d'acceptation",
    `<div class="lecon-anglais">
<h1>🎵 P16 — Let It Be — The Beatles</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Thème :</strong> Paix, acceptation, confiance<br/>
<strong>Pourquoi cette chanson ?</strong> Message positif, paroles répétitives et faciles.</p>
</div>

<h2>🎥 Vidéo</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/QDYfEBY9NM4" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles + Traduction</h2>
<div class="dialogue-box">
  <p><strong>When I find myself in times of trouble</strong><br/><em>Quand je me retrouve dans des moments de difficulté</em></p>
  <p><strong>Mother Mary comes to me</strong><br/><em>Mère Mary vient à moi</em></p>
  <p><strong>Speaking words of wisdom, let it be</strong><br/><em>Disant des mots de sagesse, laisse faire</em></p>
  <br/>
  <p><strong>And in my hour of darkness</strong><br/><em>Et dans mon heure de ténèbres</em></p>
  <p><strong>She is standing right in front of me</strong><br/><em>Elle se tient juste devant moi</em></p>
  <p><strong>Speaking words of wisdom, let it be</strong><br/><em>Disant des mots de sagesse, laisse faire</em></p>
  <br/>
  <p><strong>Let it be, let it be</strong><br/><em>Laisse faire, laisse faire</em></p>
  <p><strong>Let it be, let it be</strong><br/><em>Laisse faire, laisse faire</em></p>
  <p><strong>Whisper words of wisdom, let it be</strong><br/><em>Murmure des mots de sagesse, laisse faire</em></p>
  <br/>
  <p><strong>And when the broken-hearted people</strong><br/><em>Et quand les gens au cœur brisé</em></p>
  <p><strong>Living in the world agree</strong><br/><em>Vivant dans le monde s'entendent</em></p>
  <p><strong>There will be an answer, let it be</strong><br/><em>Il y aura une réponse, laisse faire</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Let it be</td><td>Laisse faire</td></tr>
<tr><td>Trouble</td><td>Difficulté</td></tr>
<tr><td>Wisdom</td><td>Sagesse</td></tr>
<tr><td>Darkness</td><td>Ténèbres</td></tr>
<tr><td>Whisper</td><td>Murmurer</td></tr>
<tr><td>Broken-hearted</td><td>Au cœur brisé</td></tr>
<tr><td>Answer</td><td>Réponse</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>"Let it be" = laisse faire / accepte. C'est une expression très utile dans la vie. Utilisez-la quand vous êtes stressée !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P17 — Practice : Chanson — Can't Help Falling in Love (Elvis Presley)",
    "Apprendre l'anglais avec la chanson d'amour la plus romantique de tous les temps",
    `<div class="lecon-anglais">
<h1>🎵 P17 — Can't Help Falling in Love — Elvis Presley</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Thème :</strong> Amour inévitable, romance<br/>
<strong>Pourquoi cette chanson ?</strong> Lente, claire, paroles simples. Le roi du rock a chanté l'amour.</p>
</div>

<h2>🎥 Vidéo (Live Aloha From Hawaii)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/EJzH8Z1V9J8" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles + Traduction</h2>
<div class="dialogue-box">
  <p><strong>Wise men say only fools rush in</strong><br/><em>Les sages disent que seuls les fous se précipitent</em></p>
  <p><strong>But I can't help falling in love with you</strong><br/><em>Mais je ne peux pas m'empêcher de tomber amoureux de toi</em></p>
  <p><strong>Shall I stay? Would it be a sin?</strong><br/><em>Devrais-je rester ? Serait-ce un péché ?</em></p>
  <p><strong>If I can't help falling in love with you</strong><br/><em>Si je ne peux pas m'empêcher de tomber amoureux de toi</em></p>
  <br/>
  <p><strong>Like a river flows surely to the sea</strong><br/><em>Comme une rivière coule sûrement vers la mer</em></p>
  <p><strong>Darling, so it goes</strong><br/><em>Chéri, c'est ainsi</em></p>
  <p><strong>Some things are meant to be</strong><br/><em>Certaines choses sont destinées à être</em></p>
  <br/>
  <p><strong>Take my hand, take my whole life too</strong><br/><em>Prends ma main, prends toute ma vie aussi</em></p>
  <p><strong>For I can't help falling in love with you</strong><br/><em>Car je ne peux pas m'empêcher de tomber amoureux de toi</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Can't help</td><td>Ne pas pouvoir s'empêcher</td></tr>
<tr><td>Fall in love</td><td>Tomber amoureux</td></tr>
<tr><td>Wise</td><td>Sage</td></tr>
<tr><td>Fool</td><td>Fou / Idiot</td></tr>
<tr><td>Rush in</td><td>Se précipiter</td></tr>
<tr><td>Sin</td><td>Péché</td></tr>
<tr><td>River</td><td>Rivière</td></tr>
<tr><td>Sea</td><td>Mer</td></tr>
<tr><td>Meant to be</td><td>Destiné à être</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>"Can't help" = ne pas pouvoir s'empêcher. Ex : "I can't help eating chocolate" = Je ne peux pas m'empêcher de manger du chocolat.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P18 — Practice : Chanson — Imagine (John Lennon)",
    "Apprendre l'anglais avec un message de paix universel",
    `<div class="lecon-anglais">
<h1>🎵 P18 — Imagine — John Lennon</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant — Intermédiaire<br/>
<strong>Thème :</strong> Paix, unité, rêve<br/>
<strong>Pourquoi cette chanson ?</strong> L'hymne de la paix mondiale. Vocabulaire simple mais profond.</p>
</div>

<h2>🎥 Vidéo</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/YkgkThdzX-8" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles + Traduction</h2>
<div class="dialogue-box">
  <p><strong>Imagine there's no heaven</strong><br/><em>Imagine qu'il n'y a pas de paradis</em></p>
  <p><strong>It's easy if you try</strong><br/><em>C'est facile si tu essaies</em></p>
  <p><strong>No hell below us</strong><br/><em>Pas d'enfer en dessous de nous</em></p>
  <p><strong>Above us, only sky</strong><br/><em>Au-dessus de nous, seulement le ciel</em></p>
  <br/>
  <p><strong>Imagine all the people</strong><br/><em>Imagine tous les gens</em></p>
  <p><strong>Living for today</strong><br/><em>Vivant pour aujourd'hui</em></p>
  <br/>
  <p><strong>Imagine there's no countries</strong><br/><em>Imagine qu'il n'y a pas de pays</em></p>
  <p><strong>It isn't hard to do</strong><br/><em>Ce n'est pas difficile à faire</em></p>
  <p><strong>Nothing to kill or die for</strong><br/><em>Rien pour quoi tuer ou mourir</em></p>
  <p><strong>And no religion too</strong><br/><em>Et pas de religion non plus</em></p>
  <br/>
  <p><strong>Imagine all the people</strong><br/><em>Imagine tous les gens</em></p>
  <p><strong>Living life in peace</strong><br/><em>Vivant la vie en paix</em></p>
  <br/>
  <p><strong>You may say I'm a dreamer</strong><br/><em>Tu peux dire que je suis un rêveur</em></p>
  <p><strong>But I'm not the only one</strong><br/><em>Mais je ne suis pas le seul</em></p>
  <p><strong>I hope someday you'll join us</strong><br/><em>J'espère qu'un jour tu nous rejoindras</em></p>
  <p><strong>And the world will be as one</strong><br/><em>Et le monde ne fera qu'un</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Imagine</td><td>Imaginer</td></tr>
<tr><td>Heaven</td><td>Paradis</td></tr>
<tr><td>Hell</td><td>Enfer</td></tr>
<tr><td>Country</td><td>Pays</td></tr>
<tr><td>Religion</td><td>Religion</td></tr>
<tr><td>Peace</td><td>Paix</td></tr>
<tr><td>Dreamer</td><td>Rêveur</td></tr>
<tr><td>Join</td><td>Rejoindre</td></tr>
<tr><td>World</td><td>Monde</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Cette chanson est l'hymne de la paix. Apprenez-la et chantez-la quand vous avez besoin de calme. "Imagine" = imagine — verbe très utile.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P19 — Practice : Chanson — What a Wonderful World (Louis Armstrong)",
    "Apprendre l'anglais avec une chanson qui célèbre la beauté de la vie",
    `<div class="lecon-anglais">
<h1>🎵 P19 — What a Wonderful World — Louis Armstrong</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Thème :</strong> Beauté de la nature, gratitude<br/>
<strong>Pourquoi cette chanson ?</strong> Voix magnifique, paroles simples sur la nature. Parfait pour le vocabulaire des couleurs et de la nature.</p>
</div>

<h2>🎥 Vidéo</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/rBrd_3VMC3c" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles + Traduction</h2>
<div class="dialogue-box">
  <p><strong>I see trees of green, red roses too</strong><br/><em>Je vois des arbres verts, des roses rouges aussi</em></p>
  <p><strong>I see them bloom for me and you</strong><br/><em>Je les vois fleurir pour toi et moi</em></p>
  <p><strong>And I think to myself, what a wonderful world</strong><br/><em>Et je me dis, quel monde merveilleux</em></p>
  <br/>
  <p><strong>I see skies of blue and clouds of white</strong><br/><em>Je vois des cieux bleus et des nuages blancs</em></p>
  <p><strong>The bright blessed day, the dark sacred night</strong><br/><em>Le jour lumineux et béni, la nuit sombre et sacrée</em></p>
  <p><strong>And I think to myself, what a wonderful world</strong><br/><em>Et je me dis, quel monde merveilleux</em></p>
  <br/>
  <p><strong>The colors of the rainbow, so pretty in the sky</strong><br/><em>Les couleurs de l'arc-en-ciel, si jolies dans le ciel</em></p>
  <p><strong>Are also on the faces of people going by</strong><br/><em>Sont aussi sur les visages des gens qui passent</em></p>
  <p><strong>I see friends shaking hands, saying "How do you do?"</strong><br/><em>Je vois des amis se serrer la main, disant "Comment allez-vous ?"</em></p>
  <p><strong>They're really saying "I love you"</strong><br/><em>Ils disent vraiment "Je vous aime"</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Wonderful</td><td>Merveilleux</td></tr>
<tr><td>Green</td><td>Vert</td></tr>
<tr><td>Red</td><td>Rouge</td></tr>
<tr><td>Blue</td><td>Bleu</td></tr>
<tr><td>White</td><td>Blanc</td></tr>
<tr><td>Bloom</td><td>Fleurir</td></tr>
<tr><td>Rainbow</td><td>Arc-en-ciel</td></tr>
<tr><td>Sky</td><td>Ciel</td></tr>
<tr><td>Friends</td><td>Amis</td></tr>
<tr><td>Love</td><td>Amour</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Cette chanson apprend les couleurs en anglais ! Vert (green), rouge (red), bleu (blue), blanc (white). Chantez et pointez les objets de ces couleurs autour de vous.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P20 — Practice : Chanson — Stand By Me (Ben E. King)",
    "Apprendre l'anglais avec une chanson d'amitié et de soutien intemporelle",
    `<div class="lecon-anglais">
<h1>🎵 P20 — Stand By Me — Ben E. King</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Thème :</strong> Amitié, soutien, confiance<br/>
<strong>Pourquoi cette chanson ?</strong> Rythmée, répétitive, facile à chanter. Paroles d'amitié universelles.</p>
</div>

<h2>🎥 Vidéo (Stand By Me — Playing For Change)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/Us-TVg40ExM" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><em>Version magnifique avec des musiciens du monde entier !</em></p>
</div>

<h2>📝 Paroles + Traduction</h2>
<div class="dialogue-box">
  <p><strong>When the night has come</strong><br/><em>Quand la nuit est venue</em></p>
  <p><strong>And the land is dark</strong><br/><em>Et la terre est sombre</em></p>
  <p><strong>And the moon is the only light we'll see</strong><br/><em>Et la lune est la seule lumière que nous verrons</em></p>
  <p><strong>No, I won't be afraid</strong><br/><em>Non, je n'aurai pas peur</em></p>
  <p><strong>No, I won't be afraid</strong><br/><em>Non, je n'aurai pas peur</em></p>
  <p><strong>Just as long as you stand, stand by me</strong><br/><em>Tant que tu resteras, resteras près de moi</em></p>
  <br/>
  <p><strong>So darling, darling, stand by me</strong><br/><em>Alors chéri, chéri, reste près de moi</em></p>
  <p><strong>Oh, stand by me</strong><br/><em>Oh, reste près de moi</em></p>
  <p><strong>Oh, stand now, stand by me, stand by me</strong><br/><em>Oh, reste maintenant, reste près de moi, reste près de moi</em></p>
  <br/>
  <p><strong>If the sky that we look upon</strong><br/><em>Si le ciel sur lequel nous regardons</em></p>
  <p><strong>Should tumble and fall</strong><br/><em>Devait s'effondrer et tomber</em></p>
  <p><strong>Or the mountain should crumble to the sea</strong><br/><em>Ou la montagne devait s'effriter dans la mer</em></p>
  <p><strong>I won't cry, I won't cry</strong><br/><em>Je ne pleurerai pas, je ne pleurerai pas</em></p>
  <p><strong>No, I won't shed a tear</strong><br/><em>Non, je ne verserai pas une larme</em></p>
  <p><strong>Just as long as you stand, stand by me</strong><br/><em>Tant que tu resteras, resteras près de moi</em></p>
</div>

<h2>📚 Vocabulaire</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Stand by me</td><td>Reste près de moi</td></tr>
<tr><td>Night</td><td>Nuit</td></tr>
<tr><td>Dark</td><td>Sombre</td></tr>
<tr><td>Moon</td><td>Lune</td></tr>
<tr><td>Afraid</td><td>Avoir peur</td></tr>
<tr><td>Sky</td><td>Ciel</td></tr>
<tr><td>Tumble</td><li>S'effondrer</td></tr>
<tr><td>Cry</td><td>Pleurer</td></tr>
<tr><td>Tear</td><td>Larme</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>"Stand by me" = reste près de moi / soutiens-moi. C'est une expression d'amitié très utilisée. Chantez-la à vos amies pour leur montrer que vous êtes là !</p>
</div>`,
    ordreStart++
  );

  console.log("\n✅=== 10 CHANSONS AVEC TRADUCTION CRÉÉES ===");
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
