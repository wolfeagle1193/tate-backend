const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";

const DIALOGUES = {
  // M1 — Ch1 : TO BE
  "M1 — Ch1 : The Verb 'To Be' & Personal Introductions": `
<h2>🎭 Dialogues pratiques — Se présenter</h2>

<h3>Dialogue 1 — Première rencontre (informel)</h3>
<div class="dialogue-box">
<p><strong>Tom:</strong> Hi there! I don't think we've met. I'm Tom.</p>
<p><strong>Lucy:</strong> Hi Tom! I'm Lucy. Nice to meet you!</p>
<p><strong>Tom:</strong> Nice to meet you too. Are you from around here?</p>
<p><strong>Lucy:</strong> No, I'm from Canada. I'm here for a conference. What about you?</p>
<p><strong>Tom:</strong> I'm from London. I work here as a software engineer.</p>
<p><strong>Lucy:</strong> That's interesting! How long have you been here?</p>
<p><strong>Tom:</strong> I've been here for three years. I really like the city.</p>
</div>
<p><em>💡 Points clés : "I don't think we've met" = formule pour rompre la glace. "What about you?" = pour renvoyer la question.</em></p>

<h3>Dialogue 2 — En réunion d'affaires (formel)</h3>
<div class="dialogue-box">
<p><strong>Mr. Brown:</strong> Good morning. My name is Richard Brown. I am the CEO of Global Solutions.</p>
<p><strong>Ms. Diallo:</strong> Pleased to meet you, Mr. Brown. I am Aminata Diallo, the marketing director.</p>
<p><strong>Mr. Brown:</strong> Is this your first time in New York?</p>
<p><strong>Ms. Diallo:</strong> No, it isn't. I was here last year for a trade show.</p>
<p><strong>Mr. Brown:</strong> Excellent. Shall we begin the meeting?</p>
</div>
<p><em>💡 Points clés : Titre + nom + fonction = introduction professionnelle standard. "Shall we... ?" = proposition polie.</em></p>

<h3>Dialogue 3 — Au téléphone</h3>
<div class="dialogue-box">
<p><strong>Receptionist:</strong> Good afternoon, ABC Hotel. How may I help you?</p>
<p><strong>Caller:</strong> Good afternoon. My name is Jean Dupont. I have a reservation for tonight.</p>
<p><strong>Receptionist:</strong> Thank you, Mr. Dupont. Let me check... Yes, I see your booking. A single room for two nights.</p>
<p><strong>Caller:</strong> That's correct. Is it possible to have a room with a city view?</p>
<p><strong>Receptionist:</strong> Of course, Mr. Dupont. Room 402 has a beautiful view. Is there anything else?</p>
<p><strong>Caller:</strong> No, that's all. Thank you very much.</p>
</div>
<p><em>💡 Points clés : "How may I help you?" = standard au téléphone. "Is it possible to... ?" = demande polie.</em></p>

<h3>Dialogue 4 — Se présenter à un groupe</h3>
<div class="dialogue-box">
<p><strong>Host:</strong> Welcome everyone! Let's go around the table and introduce ourselves. You start, please.</p>
<p><strong>Speaker:</strong> Thank you. My name is Maria Garcia. I am from Spain, but I live in Paris now. I am a graphic designer and I love photography. In my free time, I enjoy cooking and traveling. I'm really happy to be here today.</p>
<p><strong>Host:</strong> Thank you, Maria. Next?</p>
</div>
<p><em>💡 Points clés : Structure = Nom + Origine + Profession + Passions. Parfait pour les ice-breakers.</em></p>

<h3>Dialogue 5 — Présenter quelqu'un d'autre</h3>
<div class="dialogue-box">
<p><strong>Sarah:</strong> James, I'd like you to meet my colleague, David.</p>
<p><strong>James:</strong> Hi David, I'm James. It's a pleasure to meet you.</p>
<p><strong>David:</strong> Nice to meet you too, James. Sarah has told me a lot about you.</p>
<p><strong>James:</strong> Oh really? I hope it was all good!</p>
<p><strong>David:</strong> Only good things, don't worry! Sarah says you're an excellent project manager.</p>
<p><strong>James:</strong> That's very kind. So David, what do you do?</p>
</div>
<p><em>💡 Points clés : "I'd like you to meet..." = présenter quelqu'un. "It's a pleasure to meet you" = formel et chaleureux.</em></p>
`,

  // M1 — Ch2 : Present Simple
  "M1 — Ch2 : Present Simple & Daily Routines": `
<h2>🎭 Dialogues pratiques — Routines quotidiennes</h2>

<h3>Dialogue 1 — Deux collègues parlent de leur matinée</h3>
<div class="dialogue-box">
<p><strong>A:</strong> You look tired this morning. What time do you usually wake up?</p>
<p><strong>B:</strong> I usually wake up at 5:30 AM. I go for a run, then I shower and have breakfast.</p>
<p><strong>A:</strong> That's early! I wake up at 7. I never have time for exercise before work.</p>
<p><strong>B:</strong> Do you at least eat breakfast?</p>
<p><strong>A:</strong> Sometimes. I usually just grab a coffee and leave.</p>
<p><strong>B:</strong> You should eat something. Breakfast is the most important meal of the day!</p>
</div>
<p><em>💡 Points clés : Adverbes de fréquence (usually, never, sometimes) positionnés correctement. "You look tired" = remarque naturelle.</em></p>

<h3>Dialogue 2 — Parler des habitudes alimentaires</h3>
<div class="dialogue-box">
<p><strong>Waiter:</strong> Are you ready to order?</p>
<p><strong>Customer:</strong> Yes. I usually have the salmon, but today I'll try the pasta.</p>
<p><strong>Waiter:</strong> Excellent choice. Do you drink wine with your meal?</p>
<p><strong>Customer:</strong> No, I don't drink alcohol. I always have water with lemon.</p>
<p><strong>Waiter:</strong> Very well. Would you like dessert?</p>
<p><strong>Customer:</strong> I rarely eat dessert, but your chocolate cake looks delicious!</p>
</div>
<p><em>💡 Points clés : "I usually have... but today..." = contraste habituel/spécial. "I rarely eat... but..." = exception.</em></p>

<h3>Dialogue 3 — Week-end types</h3>
<div class="dialogue-box">
<p><strong>A:</strong> What do you do on weekends?</p>
<p><strong>B:</strong> On Saturdays, I clean the house and do the grocery shopping. On Sundays, I relax.</p>
<p><strong>A:</strong> That sounds productive! I usually sleep in on Saturdays. I don't wake up before 10.</p>
<p><strong>B:</strong> And on Sundays?</p>
<p><strong>A:</strong> I often meet friends for brunch, or I watch movies at home.</p>
<p><strong>B:</strong> Do you ever go to the gym?</p>
<p><strong>A:</strong> I go twice a week, but never on weekends!</p>
</div>
<p><em>💡 Points clés : "On Saturdays / On Sundays" = habitudes du week-end. "Sleep in" = faire la grasse matinée.</em></p>

<h3>Dialogue 4 — Parler du travail</h3>
<div class="dialogue-box">
<p><strong>A:</strong> What does your brother do?</p>
<p><strong>B:</strong> He works in a hospital. He's a nurse.</p>
<p><strong>A:</strong> That must be hard work. What time does he start?</p>
<p><strong>B:</strong> He starts at 7 AM and finishes at 3 PM. But sometimes he works night shifts.</p>
<p><strong>A:</strong> Does he like his job?</p>
<p><strong>B:</strong> Yes, he loves it. He says it's very rewarding, even though it's tiring.</p>
</div>
<p><em>💡 Points clés : "What does... do?" = demander le métier. "He says..." = rapporté au présent simple.</em></p>

<h3>Dialogue 5 — Discuter des préférences</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Do you like coffee?</p>
<p><strong>B:</strong> I love it! I drink three cups every morning.</p>
<p><strong>A:</strong> Really? I prefer tea. I think coffee is too strong for me.</p>
<p><strong>B:</strong> What about food? Do you like spicy food?</p>
<p><strong>A:</strong> Yes, I do! I always add chili to my dishes.</p>
<p><strong>B:</strong> Me too! We should go to that new Indian restaurant together.</p>
</div>
<p><em>💡 Points clés : "Do you like...?" / "I prefer..." = expressions de préférence. "Me too!" = accord.</em></p>
`,

  // M1 — Ch3 : Present Continuous
  "M1 — Ch3 : Present Continuous & Actions in Progress": `
<h2>🎭 Dialogues pratiques — Actions en cours</h2>

<h3>Dialogue 1 — Au téléphone pendant une activité</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Hey, what are you doing? I hear music.</p>
<p><strong>B:</strong> I'm cooking dinner. I'm making chicken curry.</p>
<p><strong>A:</strong> That sounds delicious! Who are you cooking for?</p>
<p><strong>B:</strong> I'm having some friends over tonight. We're celebrating Sarah's birthday.</p>
<p><strong>A:</strong> Oh, nice! Are you doing anything special?</p>
<p><strong>B:</strong> Yes, I'm baking a cake right now, and later we're going to a karaoke bar.</p>
</div>
<p><em>💡 Points clés : "What are you doing?" + bruit de fond = contexte naturel. "I'm having friends over" = recevoir des amis.</em></p>

<h3>Dialogue 2 — Décrire une scène (photo/vidéo)</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Look at this photo from the park. What are the children doing?</p>
<p><strong>B:</strong> The boy is flying a kite, and the girl is riding a bicycle.</p>
<p><strong>A:</strong> And what is the woman in the red jacket doing?</p>
<p><strong>B:</strong> She's sitting on a bench and reading a book. Oh, and the dog is running after a ball!</p>
<p><strong>A:</strong> What a lovely scene! It looks like a perfect Sunday afternoon.</p>
</div>
<p><em>💡 Points clés : Parfait pour décrire des images. "The boy is... and the girl is..." = structure parallèle.</em></p>

<h3>Dialogue 3 — Changer de plans</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Are you still coming to the gym tonight?</p>
<p><strong>B:</strong> Actually, I'm working late today. We're launching a new product tomorrow.</p>
<p><strong>A:</strong> No problem. What about tomorrow evening?</p>
<p><strong>B:</strong> Tomorrow I'm meeting a client for dinner. How about Wednesday?</p>
<p><strong>A:</strong> Wednesday works for me. I'm not doing anything special that evening.</p>
</div>
<p><em>💡 Points clés : "I'm working late" = situation temporaire. "I'm meeting" = arrangement futur confirmé.</em></p>

<h3>Dialogue 4 — Visite guidée (tour guide)</h3>
<div class="dialogue-box">
<p><strong>Guide:</strong> Ladies and gentlemen, welcome to the museum. Right now, we're standing in the main hall. If you look up, you can see the beautiful ceiling.</p>
<p><strong>Tourist:</strong> Excuse me, what are those people doing over there?</p>
<p><strong>Guide:</strong> Oh, they're restoring an old painting. It takes months to complete.</p>
<p><strong>Tourist:</strong> And what is that machine in the corner?</p>
<p><strong>Guide:</strong> It's a 3D scanner. The museum is digitizing its collection.</p>
</div>
<p><em>💡 Points clés : "Right now" + Present Continuous = description en direct. Parfait pour les visites.</em></p>

<h3>Dialogue 5 — Parler d'un changement</h3>
<div class="dialogue-box">
<p><strong>A:</strong> You've changed your apartment! It looks amazing.</p>
<p><strong>B:</strong> Thanks! I'm redecorating everything. I'm painting the walls and buying new furniture.</p>
<p><strong>A:</strong> I see you're getting more plants too.</p>
<p><strong>B:</strong> Yes, I'm turning this place into a jungle! Plants make me happy.</p>
<p><strong>A:</strong> Your style is definitely changing. I like it!</p>
</div>
<p><em>💡 Points clés : Present Continuous = changement en cours. "I'm turning... into..." = transformation.</em></p>
`,

  // M1 — Ch4 : Simple Past
  "M1 — Ch4 : Simple Past & Life Stories": `
<h2>🎭 Dialogues pratiques — Raconter le passé</h2>

<h3>Dialogue 1 — Parler du week-end passé</h3>
<div class="dialogue-box">
<p><strong>A:</strong> How was your weekend?</p>
<p><strong>B:</strong> It was great! On Saturday, I went hiking with some friends. We woke up early and drove to the mountains.</p>
<p><strong>A:</strong> That sounds fun. Did you have good weather?</p>
<p><strong>B:</strong> Yes, but it got cloudy in the afternoon. We had lunch at a small restaurant near the lake.</p>
<p><strong>A:</strong> What did you do on Sunday?</p>
<p><strong>B:</strong> I stayed home and rested. I watched a movie and cooked a big dinner.</p>
</div>
<p><em>💡 Points clés : "How was your weekend?" = question classique le lundi. Chronologie claire : Saturday → Sunday.</em></p>

<h3>Dialogue 2 — Raconter un voyage</h3>
<div class="dialogue-box">
<p><strong>A:</strong> I heard you went to Morocco. How was it?</p>
<p><strong>B:</strong> Incredible! We flew from Dakar to Casablanca. The flight took about three hours.</p>
<p><strong>A:</strong> Where did you stay?</p>
<p><strong>B:</strong> We stayed in a traditional riad in Marrakech. It was beautiful.</p>
<p><strong>A:</strong> What did you do there?</p>
<p><strong>B:</strong> We visited the souks, ate amazing food, and rode camels in the desert. I took hundreds of photos!</p>
</div>
<p><em>💡 Points clés : "How was it?" = demander une impression. Verbes d'action forts : flew, took, rode, ate.</em></p>

<h3>Dialogue 3 — Parler d'un accident</h3>
<div class="dialogue-box">
<p><strong>A:</strong> What happened to your car? I see a big scratch.</p>
<p><strong>B:</strong> Oh, I had a small accident yesterday. I was parking and I hit a pole.</p>
<p><strong>A:</strong> Were you hurt?</p>
<p><strong>B:</strong> No, thank God. But the car needs repairs. I called the insurance company this morning.</p>
<p><strong>A:</strong> Did they say how much it will cost?</p>
<p><strong>B:</strong> They sent someone to check it. I'll know tomorrow.</p>
</div>
<p><em>💡 Points clés : "What happened?" / "Were you hurt?" = questions d'urgence. "I called... this morning" = action passée récente.</em></p>

<h3>Dialogue 4 — Souvenirs d'enfance</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Where did you grow up?</p>
<p><strong>B:</strong> I grew up in a small village near the coast. We lived in a big house with a garden.</p>
<p><strong>A:</strong> What did you do for fun?</p>
<p><strong>B:</strong> I played football with the neighborhood kids. We spent hours outside.</p>
<p><strong>A:</strong> Did you have a favorite place?</p>
<p><strong>B:</strong> Yes, there was a beach nearby. My grandfather taught me how to fish there.</p>
</div>
<p><em>💡 Points clés : "Where did you grow up?" = origines. "We spent hours" = durée indéfinie au passé.</em></p>

<h3>Dialogue 5 — Première journée au travail</h3>
<div class="dialogue-box">
<p><strong>A:</strong> How was your first day at the new job?</p>
<p><strong>B:</strong> It was overwhelming but exciting. I met my team and my manager showed me around the office.</p>
<p><strong>A:</strong> Did you get your computer and everything?</p>
<p><strong>B:</strong> Yes, IT gave me a laptop and set up my email. I attended two meetings in the afternoon.</p>
<p><strong>A:</strong> How did you feel at the end of the day?</p>
<p><strong>B:</strong> Exhausted! But everyone was so nice. I think I'm going to like it here.</p>
</div>
<p><em>💡 Points clés : "How was your first day?" = question standard. "My manager showed me around" = visite d'orientation.</em></p>
`,

  // M1 — Ch5 : Future
  "M1 — Ch5 : Future Tenses & Projects": `
<h2>🎭 Dialogues pratiques — Projets et futur</h2>

<h3>Dialogue 1 — Plans pour le week-end</h3>
<div class="dialogue-box">
<p><strong>A:</strong> What are you doing this weekend?</p>
<p><strong>B:</strong> I'm going to visit my parents. I haven't seen them in two months.</p>
<p><strong>A:</strong> That'll be nice. Will you stay for the whole weekend?</p>
<p><strong>B:</strong> I'm leaving on Friday evening and coming back on Sunday night. I'm going to help my dad fix the roof.</p>
<p><strong>A:</strong> Oh, fun! I'm sure he'll appreciate that.</p>
<p><strong>B:</strong> What about you? Any plans?</p>
<p><strong>A:</strong> I'm not sure yet. I might just stay home and catch up on sleep.</p>
</div>
<p><em>💡 Points clés : "What are you doing this weekend?" = arrangement futur. "I might just..." = possibilité faible.</em></p>

<h3>Dialogue 2 — Projets professionnels</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Where do you see yourself in five years?</p>
<p><strong>B:</strong> I hope I'll have my own company by then. I'm going to start small, maybe a consulting business.</p>
<p><strong>A:</strong> That sounds ambitious. Will you need investors?</p>
<p><strong>B:</strong> Probably. I'm meeting a potential partner next week. We're going to discuss the business plan.</p>
<p><strong>A:</strong> Good luck! I'm sure you'll succeed.</p>
</div>
<p><em>💡 Points clés : "Where do you see yourself... ?" = question d'entretien classique. "I'm meeting" = arrangement confirmé.</em></p>

<h3>Dialogue 3 — Offre spontanée</h3>
<div class="dialogue-box">
<p><strong>A:</strong> This box is so heavy!</p>
<p><strong>B:</strong> I'll help you carry it. Where does it go?</p>
<p><strong>A:</strong> Thanks! Just to the car, please.</p>
<p><strong>B:</strong> No problem. Wow, it is heavy! What's inside?</p>
<p><strong>A:</strong> Books. I'm donating them to the library.</p>
<p><strong>B:</strong> That's very kind. I'll give you a hand with the others too.</p>
</div>
<p><em>💡 Points clés : "I'll help you" = décision spontanée au moment de parler. "I'll give you a hand" = expression idiomatique.</em></p>

<h3>Dialogue 4 — Prédiction basée sur des indices</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Look at those dark clouds. It's going to rain.</p>
<p><strong>B:</strong> You're right. And the wind is getting stronger too.</p>
<p><strong>A:</strong> We should go inside. I'm going to close the windows.</p>
<p><strong>B:</strong> Good idea. I'll get an umbrella just in case.</p>
<p><strong>A:</strong> Do you think the storm will be bad?</p>
<p><strong>B:</strong> The forecast said it might last all evening. We should stay home tonight.</p>
</div>
<p><em>💡 Points clés : "Look at those clouds. It's going to rain." = prédiction avec indices visibles. "Just in case" = au cas où.</em></p>

<h3>Dialogue 5 — Promesses et engagements</h3>
<div class="dialogue-box">
<p><strong>Child:</strong> Dad, will you come to my school play?</p>
<p><strong>Father:</strong> Of course I will. I promise I'll be there.</p>
<p><strong>Child:</strong> And will you bring Grandma too?</p>
<p><strong>Father:</strong> I'll ask her. I'm sure she'll love to come.</p>
<p><strong>Child:</strong> What time will it start?</p>
<p><strong>Father:</strong> It starts at 6 PM. I'll leave work early so we won't be late.</p>
</div>
<p><em>💡 Points clés : "I promise I'll..." = promesse forte. "I'll leave work early" = intention/decision.</em></p>
`,

  // M1 — Ch6 : Modals
  "M1 — Ch6 : Modal Verbs — Can, Must, Should, May": `
<h2>🎭 Dialogues pratiques — Modaux en action</h2>

<h3>Dialogue 1 — Demander la permission</h3>
<div class="dialogue-box">
<p><strong>Student:</strong> Excuse me, Professor. May I ask a question?</p>
<p><strong>Professor:</strong> Of course. Go ahead.</p>
<p><strong>Student:</strong> Can we use a calculator during the exam?</p>
<p><strong>Professor:</strong> No, you can't. You must do all calculations by hand.</p>
<p><strong>Student:</strong> Understood. And can we leave early if we finish?</p>
<p><strong>Professor:</strong> You may leave after 45 minutes. But you must stay silent until then.</p>
</div>
<p><em>💡 Points clés : "May I ask...?" = formel/polie. "Can we...?" = permission informelle. "You must" = obligation.</em></p>

<h3>Dialogue 2 — Donner des conseils</h3>
<div class="dialogue-box">
<p><strong>A:</strong> I have a terrible headache. What should I do?</p>
<p><strong>B:</strong> You should drink more water and take a break from the screen.</p>
<p><strong>A:</strong> I took a painkiller but it didn't help.</p>
<p><strong>B:</strong> You should see a doctor if it doesn't get better by tomorrow.</p>
<p><strong>A:</strong> Should I go to the hospital?</p>
<p><strong>B:</strong> No, you don't have to. A regular doctor's appointment should be enough.</p>
</div>
<p><em>💡 Points clés : "What should I do?" = demande de conseil. "You should..." = recommandation. "You don't have to" = pas obligé.</em></p>

<h3>Dialogue 3 — Capacité et possibilité</h3>
<div class="dialogue-box">
<p><strong>Manager:</strong> Can you speak Spanish?</p>
<p><strong>Employee:</strong> Yes, I can. I lived in Madrid for two years.</p>
<p><strong>Manager:</strong> Perfect. We have a client from Mexico next week. Could you handle the meeting?</p>
<p><strong>Employee:</strong> I'd be happy to. I might also bring Maria — she can translate if needed.</p>
<p><strong>Manager:</strong> Great idea. Can you prepare a presentation by Thursday?</p>
<p><strong>Employee:</strong> Yes, I can. I'll have it ready by Wednesday.</p>
</div>
<p><em>💡 Points clés : "Can you...?" = capacité. "Could you...?" = demande polie. "I might" = possibilité faible.</em></p>

<h3>Dialogue 4 — Obligations au travail</h3>
<div class="dialogue-box">
<p><strong>Boss:</strong> Listen, the deadline has changed. We must finish this project by Friday.</p>
<p><strong>Employee:</strong> That's two days earlier! Do we have to work overtime?</p>
<p><strong>Boss:</strong> I'm afraid so. Everyone must stay until 8 PM this week.</p>
<p><strong>Employee:</strong> Must we come in on Saturday too?</p>
<p><strong>Boss:</strong> No, you don't have to. But if you want to, it's appreciated.</p>
<p><strong>Employee:</strong> Understood. We'll do our best.</p>
</div>
<p><em>💡 Points clés : "We must finish" = obligation interne. "Do we have to...?" = obligation externe. "You don't have to" = pas obligé.</em></p>

<h3>Dialogue 5 — À l'aéroport</h3>
<div class="dialogue-box">
<p><strong>Passenger:</strong> Excuse me, may I have a window seat?</p>
<p><strong>Agent:</strong> Let me check... Yes, seat 14A is available. May I see your passport?</p>
<p><strong>Passenger:</strong> Here it is. Can I bring this bag on board?</p>
<p><strong>Agent:</strong> I'm afraid it's too large. You must check it in.</p>
<p><strong>Passenger:</strong> Should I pay extra?</p>
<p><strong>Agent:</strong> No, you shouldn't. It's within your allowance.</p>
</div>
<p><em>💡 Points clés : "May I have...?" = demande polie. "You must check it in" = obligation. "You shouldn't" = pas nécessaire.</em></p>
`,
};

// Dialogues génériques pour les autres chapitres
function getGenericDialogues(titre) {
  return `
<h2>🎭 Dialogues pratiques</h2>

<h3>Dialogue 1 — Situation quotidienne</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Good morning! How are you doing today?</p>
<p><strong>B:</strong> I'm doing well, thanks. And you?</p>
<p><strong>A:</strong> Not bad at all. Did you have a good evening?</p>
<p><strong>B:</strong> Yes, I did. I relaxed at home and watched a movie.</p>
<p><strong>A:</strong> That sounds nice. What are your plans for today?</p>
<p><strong>B:</strong> I have a busy day ahead. I need to finish some work and then go to the gym.</p>
</div>
<p><em>💡 Points clés : Salutations standard. "How are you doing?" = plus informel que "How are you?"</em></p>

<h3>Dialogue 2 — Au travail</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Could we schedule a meeting for tomorrow?</p>
<p><strong>B:</strong> Sure. What time works for you?</p>
<p><strong>A:</strong> How about 10 AM? I should be free by then.</p>
<p><strong>B:</strong> 10 AM works for me. Should we invite the whole team?</p>
<p><strong>A:</strong> Yes, I think everyone should be there. I'll send the invitation.</p>
<p><strong>B:</strong> Perfect. See you tomorrow at 10.</p>
</div>
<p><em>💡 Points clés : "Could we...?" = proposition polie. "How about...?" = suggestion.</em></p>

<h3>Dialogue 3 — Faire des courses</h3>
<div class="dialogue-box">
<p><strong>A:</strong> Excuse me, where can I find the rice?</p>
<p><strong>B:</strong> It's on aisle 3, next to the pasta.</p>
<p><strong>A:</strong> Thank you. Do you have brown rice?</p>
<p><strong>B:</strong> Yes, we do. It's on the top shelf. Would you like me to get it for you?</p>
<p><strong>A:</strong> No, it's fine. I can reach it. How much is it?</p>
<p><strong>B:</strong> It's $4.99 for a one-kilo bag.</p>
</div>
<p><em>💡 Points clés : "Where can I find...?" = demander un produit. "Would you like me to...?" = offre de service.</em></p>

<h3>Dialogue 4 — Demander des directions</h3>
<div class="dialogue-box">
<p><strong>Tourist:</strong> Excuse me, could you tell me how to get to the train station?</p>
<p><strong>Local:</strong> Of course. Go straight ahead for two blocks, then turn left.</p>
<p><strong>Tourist:</strong> Is it far? Can I walk there?</p>
<p><strong>Local:</strong> It's about 10 minutes on foot. You can also take bus number 12.</p>
<p><strong>Tourist:</strong> Thank you so much. Have a nice day!</p>
<p><strong>Local:</strong> You're welcome. Enjoy your visit!</p>
</div>
<p><em>💡 Points clés : "Could you tell me how to get to...?" = demander le chemin. "Go straight ahead" = tout droit.</em></p>

<h3>Dialogue 5 — Au restaurant</h3>
<div class="dialogue-box">
<p><strong>Waiter:</strong> Good evening. Do you have a reservation?</p>
<p><strong>Customer:</strong> Yes, under the name Diallo. Table for two.</p>
<p><strong>Waiter:</strong> Perfect. Follow me, please. Here are your menus. Can I get you anything to drink?</p>
<p><strong>Customer:</strong> I'll have a glass of water, please. And my wife would like some orange juice.</p>
<p><strong>Waiter:</strong> Very well. I'll be back to take your order in a few minutes.</p>
</div>
<p><em>💡 Points clés : "Do you have a reservation?" = standard au restaurant. "I'll have..." = commander.</em></p>
`;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const matiere = await db.collection("matieres").findOne({ code: "AN-AD" });
  if (!matiere) { console.log("❌ Matière AN-AD non trouvée"); await mongoose.disconnect(); return; }
  const matId = matiere._id.toString();

  const chapitres = await db.collection("chapitres").find({ matiereId: new mongoose.Types.ObjectId(matId), niveau: "Adulte" }).toArray();
  console.log(`📚 ${chapitres.length} chapitres trouvés`);

  let updated = 0;

  for (const chap of chapitres) {
    const lecon = await db.collection("lecons").findOne({ chapitreId: chap._id });
    if (!lecon || !lecon.contenuHTML) continue;

    // Ne pas modifier les chapitres Listening et Vocabulary (qui ont déjà leurs propres dialogues/textes)
    if (/^L\d+/i.test(chap.titre) || /^V\d+/i.test(chap.titre)) {
      console.log(`  ⏭️  Skipped: ${chap.titre} (Listening/Vocabulary)`);
      continue;
    }

    // Vérifier si déjà des dialogues
    if (lecon.contenuHTML.includes('Dialogues pratiques')) {
      console.log(`  ⏭️  Skipped: ${chap.titre} (déjà enrichi)`);
      continue;
    }

    const dialoguesHTML = DIALOGUES[chap.titre] || getGenericDialogues(chap.titre);
    const newHTML = lecon.contenuHTML + dialoguesHTML;

    await db.collection("lecons").updateOne(
      { _id: lecon._id },
      { $set: { contenuHTML: newHTML, updatedAt: new Date() } }
    );

    updated++;
    console.log(`  ✅ Enrichi: ${chap.titre}`);
  }

  console.log(`\n✅=== ${updated} LEÇONS ENRICHIES AVEC DIALOGUES ===`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
