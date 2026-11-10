// Story scripts, NPC dialog trees, and quest emote evaluators for UP Baguio Flora Quest.
//
// Emote numbers from Ninja Adventure pack:
//   22 = red ! (quest available or ready to turn in)
//   25 = red ? (quest in progress)
//   27 = heart (quest completed / healed)
//   12 = sick / unwell

export function getNpcEmoteNumber(npcId, state) {
  const q = state.data.quests;

  switch (npcId) {
    case 'prof_dulay': {
      if (q.m1_saleng === 'available') return 22;
      if (q.m1_saleng === 'active') {
        return state.hasCollected('benguet_pine') && state.data.flags.talked_apo_sabado ? 22 : 25;
      }
      const readyForFinale =
        ['m2_lagundi', 'm3_sambong', 'm4_tsaang_gubat', 'm5_takip_kuhol'].every(
          (k) => q[k] === 'completed',
        ) && !state.data.flags.finale_complete;
      if (readyForFinale) return 22;
      if (state.data.flags.finale_complete) return 27;
      return null;
    }

    case 'apo_sabado': {
      if (q.m1_saleng === 'active' && !state.data.flags.talked_apo_sabado) return 22;
      if (state.data.flags.talked_apo_sabado) return 27;
      return null;
    }

    case 'paolo': {
      if (q.m2_lagundi === 'available') return 22;
      if (q.m2_lagundi === 'active') return state.hasCollected('lagundi') ? 22 : 12;
      if (q.m2_lagundi === 'completed') return 27;
      return 12;
    }

    case 'manong_ben': {
      if (q.m3_sambong === 'available') return 22;
      if (q.m3_sambong === 'active') return state.hasCollected('sambong') ? 22 : 25;
      if (q.m3_sambong === 'completed') return 27;
      return null;
    }

    case 'ate_lorna': {
      if (q.m4_tsaang_gubat === 'available') return 22;
      if (q.m4_tsaang_gubat === 'active') return state.hasCollected('tsaang_gubat') ? 22 : 25;
      if (q.m4_tsaang_gubat === 'completed') return 27;
      return null;
    }

    case 'junjun': {
      return q.m4_tsaang_gubat === 'completed' ? 27 : 12;
    }

    case 'kiko': {
      if (q.m5_takip_kuhol === 'available') return 22;
      if (q.m5_takip_kuhol === 'active') return state.hasCollected('takip_kuhol') ? 22 : 12;
      if (q.m5_takip_kuhol === 'completed') return 27;
      return 12;
    }

    case 'curator': {
      if (q.m6_benguet_lily === 'available') return 22;
      if (q.m6_benguet_lily === 'active') return state.hasCollected('benguet_lily') ? 22 : 25;
      if (q.m6_benguet_lily === 'completed') return 27;
      return null;
    }

    case 'bea': {
      if (q.s1_sunflower === 'available') return 22;
      if (q.s1_sunflower === 'active') return state.isIdentified('mexican_sunflower') ? 22 : 25;
      if (q.s1_sunflower === 'completed') return 27;
      return null;
    }

    default:
      return null;
  }
}

export function getNpcDialogPages(npc, state, callbacks) {
  const player = state.data.playerName;
  const q = state.data.quests;

  switch (npc.id) {
    case 'prof_dulay': {
      if (q.m1_saleng === 'available') {
        return [
          {
            speaker: npc.name,
            text: `Marhay na aga, ${player}! Welcome to the University of the Philippines Baguio. I’m Prof. Mila Dulay from the Department of Biology.`,
          },
          {
            speaker: npc.name,
            text: `We are launching "Project Saleng" — an interactive campus herbarium documenting Cordillera native flora and DOH-validated Philippine medicinal plants.`,
          },
          {
            speaker: npc.name,
            text: `For your first field task (Mission 1): walk up to the tall Benguet Pine in the UPB Woods (#15) just northwest of the Oblation Ground, press [E] to Observe & Identify it, and record a voucher in your Herbarium!`,
          },
          {
            speaker: npc.name,
            text: `After documenting the pine, speak with Apo Sabado standing nearby to learn why Cordillera elders call it "saleng".`,
            onFinish: () => {
              state.setFlag('talked_prof_intro', true);
              state.setQuestStatus('m1_saleng', 'active');
              callbacks.toast('📋 Mission 1 Started: Roots of the Campus (Saleng)');
            },
          },
        ];
      }

      if (q.m1_saleng === 'active') {
        const hasPine = state.hasCollected('benguet_pine');
        const talkedApo = state.data.flags.talked_apo_sabado;

        if (!hasPine) {
          return [
            {
              speaker: npc.name,
              text: `Step right up to the Benguet Pine northwest of the Oblation Plaza (look for the sparkling tree) and press [E]. Use OBSERVE to inspect its 3-needle bundles, then IDENTIFY and COLLECT a photo voucher!`,
            },
          ];
        }
        if (!talkedApo) {
          return [
            {
              speaker: npc.name,
              text: `Wonderful botanical observation, ${player}! Now please speak with Apo Sabado just beside the pine tree to record its Ibaloi ethnobotanical lore.`,
            },
          ];
        }
        return [
          {
            speaker: npc.name,
            text: `Bravo, ${player}! You combined scientific taxonomy (Pinus kesiya) with indigenous Cordillera knowledge (Saleng).`,
          },
          {
            speaker: npc.name,
            text: `Now you’re ready to help our UP Baguio community! Several students and staff around campus have common ailments that DOH-approved herbal plants can soothe:`,
          },
          {
            speaker: npc.name,
            text: `• Library & CAC Courtyard (#6 / #7, Elev 0): Your classmate Paolo has a stubborn cough.\n• Oblation Driveway Gate (East, Elev 0): Guard Manong Ben needs a diuretic herb from the Summit KA/CS Quad (Elev 3).\n• Open Court A (#21, Elev 0): Varsity player Kiko scraped his knee.\n• Balay Panganan / Cafeteria (#13, Elev 2–3): Ate Lorna’s son Jun-jun has stomach cramps.`,
            onFinish: () => {
              state.setQuestStatus('m1_saleng', 'completed');
              callbacks.toast('🌟 Mission 1 Complete! Campus Herbal Missions M2–M6 Unlocked!');
            },
          },
        ];
      }

      // Check if all 4 medicinal missions are completed
      const medDone = ['m2_lagundi', 'm3_sambong', 'm4_tsaang_gubat', 'm5_takip_kuhol'].every(
        (k) => q[k] === 'completed',
      );
      if (medDone && !state.data.flags.finale_complete) {
        return [
          {
            speaker: npc.name,
            text: `Incredible fieldwork, ${player}! You helped Paolo with Lagundi, Manong Ben with Sambong, Jun-jun with Tsaang Gubat, and Kiko with Takip-kuhol!`,
          },
          {
            speaker: npc.name,
            text: `And you always reminded everyone of our golden medical rule: herbal remedies support, but never replace, professional medical care and proper hygiene.`,
          },
          {
            speaker: npc.name,
            text: `On behalf of the College of Science and UP Baguio, I hereby certify you as Senior Student Curator of Project Saleng! Feel free to keep exploring Pine Hill until all 9 species are in your Herbarium!`,
            onFinish: () => {
              state.setFlag('finale_complete', true);
              callbacks.toast('🏆 Project Saleng Demo Complete! Congratulations, Senior Curator!');
            },
          },
        ];
      }

      return [
        {
          speaker: npc.name,
          text: `Keep exploring the campus terraces, ${player}! Press [J] anytime to open your Digital Herbarium and check active missions.`,
        },
      ];
    }

    case 'apo_sabado': {
      return [
        {
          speaker: npc.name,
          text: `Greetings, young biologist. Look closely at this Pinus kesiya. In our Ibaloi and Kankanaey tongues, we call it "saleng".`,
        },
        {
          speaker: npc.name,
          text: `Its heartwood is rich with fragrant pine resin. Long before electric lamps, our ancestors split fallen saleng wood for torches and kindling during cold Cordillera nights.`,
        },
        {
          speaker: npc.name,
          text: `Even more important, saleng roots hold our mountain slopes together and catch the fog drip that feeds Baguio’s springs. Respect the living trees — take only photographs and fallen cones!`,
          onFinish: () => {
            if (!state.data.flags.talked_apo_sabado) {
              state.setFlag('talked_apo_sabado', true);
              callbacks.toast('🌲 Recorded Apo Sabado’s oral history on Saleng!');
            }
          },
        },
      ];
    }

    case 'paolo': {
      if (q.m2_lagundi === 'locked') {
        return [
          {
            speaker: npc.name,
            text: `*Cough, cough!* Ugh, pulling an all-nighter in this chilly Baguio fog gave me a dry cough. Talk to Prof. Dulay at the Plaza first — she mentioned you’re studying medicinal flora!`,
          },
        ];
      }
      if (q.m2_lagundi === 'available') {
        return [
          {
            speaker: npc.name,
            text: `*Cough, cough!* Hey classmate ${player}... studying late at the UPB Library in this chilly Baguio fog got my throat acting up. No high fever, just an annoying dry cough before our Bio exam.`,
          },
          {
            speaker: npc.name,
            text: `Nurse Ruth said the Department of Health (DOH) recommends a leaf decoction from a native 5-leaflet shrub with lavender flowers growing right here on the CSS & Library Courtyard slope!`,
          },
          {
            speaker: npc.name,
            text: `Could you examine the shrub just west of the Library (look for the 5 palmate leaflets), identify it, and collect fresh leaves for a warm tea?`,
            onFinish: () => {
              state.setQuestStatus('m2_lagundi', 'active');
              callbacks.toast('📋 Mission 2 Started: Ubo sa Library Courtyard (Find Lagundi)');
            },
          },
        ];
      }
      if (q.m2_lagundi === 'active') {
        if (!state.hasCollected('lagundi')) {
          return [
            {
              speaker: npc.name,
              text: `*Cough!* The shrub is right between the Library (#7) and CSS (#4) on the west garden slope. Look for leaves divided into 5 narrow leaflets like fingers on a hand!`,
            },
          ];
        }
        return [
          {
            speaker: npc.name,
            text: `You found fresh Lagundi (Vitex negundo — "dangla" in Ilocano)! Look at those 5 narrow leaflets!`,
          },
          {
            speaker: npc.name,
            text: `I’ll wash a half-cup of leaves and boil them in 2 glasses of water for 15 minutes. And don’t worry — if my cough ever lasts more than 2 weeks or I get short of breath, I’ll go straight to the UHS doctor. Salamat, ${player}!`,
            onFinish: () => {
              state.setQuestStatus('m2_lagundi', 'completed');
              callbacks.toast('💚 Mission 2 Complete! Paolo brewed DOH-approved Lagundi tea.');
            },
          },
        ];
      }
      return [
        {
          speaker: npc.name,
          text: `That warm Lagundi decoction really relaxed my airways! Nothing beats Filipino science backing traditional herbal medicine.`,
        },
      ];
    }

    case 'manong_ben': {
      if (q.m3_sambong === 'locked') {
        return [
          {
            speaker: npc.name,
            text: `Good day, iskolar! Welcome to UP Baguio. Prof. Dulay is waiting for you near the Oblation monument just ahead.`,
          },
        ];
      }
      if (q.m3_sambong === 'available') {
        return [
          {
            speaker: npc.name,
            text: `Aba, ${player}! Standing guard at the Main Gate all day makes my ankles swell, and my doctor at Baguio General told me to keep flushing my kidneys because of my small urinary stone history.`,
          },
          {
            speaker: npc.name,
            text: `He said one of the top DOH-approved herbal medicines is a tall, fuzzy-leaved plant that smells strongly of camphor — we call it "subusob" in Ilocano!`,
          },
          {
            speaker: npc.name,
            text: `There’s a healthy patch growing on the Summit Plateau (Elevation 3) right on the KA / College of Science Quad (#12). Could you climb up past Open Court A and the Inang Laya steps, identify it, and bring me some leaves?`,
            onFinish: () => {
              state.setQuestStatus('m3_sambong', 'active');
              callbacks.toast('📋 Mission 3 Started: Manong Ben’s Burden (Find Sambong)');
            },
          },
        ];
      }
      if (q.m3_sambong === 'active') {
        if (!state.hasCollected('sambong')) {
          return [
            {
              speaker: npc.name,
              text: `Climb up the Driveway stairs to Open Court A (Elev 2), then up the Court A steps (#20) to the Summit Crown (Elev 3). Look on the KA / College of Science Quad for silvery, camphor-scented leaves!`,
            },
          ];
        }
        return [
          {
            speaker: npc.name,
            text: `Ayos! You brought Sambong (Blumea balsamifera — our Ilocano subusob)! Just smelling that cool camphor leaf feels refreshing.`,
          },
          {
            speaker: npc.name,
            text: `I’ll boil a decoction for my thermos and drink plenty of water alongside my doctor’s checkups. Agyamanak unay, ${player}!`,
            onFinish: () => {
              state.setQuestStatus('m3_sambong', 'completed');
              callbacks.toast('💚 Mission 3 Complete! Manong Ben received Sambong leaves.');
            },
          },
        ];
      }
      return [
        {
          speaker: npc.name,
          text: `My feet feel much lighter today, ${player}! Always proud of our UP Baguio biology students.`,
        },
      ];
    }

    case 'ate_lorna': {
      if (q.m4_tsaang_gubat === 'locked') {
        return [
          {
            speaker: npc.name,
            text: `Welcome to the UPB Student Canteen! Go check in with Prof. Dulay at the Oblation Plaza first, anak.`,
          },
        ];
      }
      if (q.m4_tsaang_gubat === 'available') {
        return [
          {
            speaker: npc.name,
            text: `Naku, ${player}, good thing you’re here! My little boy Jun-jun ate too fast and now he has mild stomach cramps and loose stool.`,
          },
          {
            speaker: npc.name,
            text: `I already mixed him a glass of Oral Rehydration Salts (ORS) so he stays hydrated, but I also want to brew the DOH-approved native shrub for stomachache — the one with tiny glossy green leaves and white star flowers.`,
          },
          {
            speaker: npc.name,
            text: `It grows right along the east hedge of our canteen path! Can you identify it and gather a clean leaf cluster?`,
            onFinish: () => {
              state.setQuestStatus('m4_tsaang_gubat', 'active');
              callbacks.toast('📋 Mission 4 Started: Sakit ng Tiyan (Find Tsaang Gubat)');
            },
          },
        ];
      }
      if (q.m4_tsaang_gubat === 'active') {
        if (!state.hasCollected('tsaang_gubat')) {
          return [
            {
              speaker: npc.name,
              text: `Check the bushy hedge just a few steps northeast of the canteen! Look for small, shiny dark-green leaves clustered on woody twigs.`,
            },
          ];
        }
        return [
          {
            speaker: npc.name,
            text: `Maraming salamat, ${player}! Fresh Tsaang Gubat (Ehretia microphylla)! Its antispasmodic properties calm stomach cramps so well.`,
          },
          {
            speaker: npc.name,
            text: `I’ll boil the washed leaves for 15 minutes and keep giving Jun-jun his ORS fluids. Look, he’s smiling already!`,
            onFinish: () => {
              state.setQuestStatus('m4_tsaang_gubat', 'completed');
              callbacks.toast('💚 Mission 4 Complete! Jun-jun’s stomachache is soothing.');
            },
          },
        ];
      }
      return [
        {
          speaker: npc.name,
          text: `Tsaang Gubat tea plus proper Oral Rehydration Salts worked wonders for Jun-jun! Drop by anytime for hot turon!`,
        },
      ];
    }

    case 'junjun': {
      if (q.m4_tsaang_gubat === 'completed') {
        return [
          {
            speaker: npc.name,
            text: `My tummy doesn’t hurt anymore, Kuya/Ate ${player}! Tsaang Gubat tastes like mild green tea!`,
          },
        ];
      }
      return [
        {
          speaker: npc.name,
          text: `Ouch... my tummy feels twisty. Nanay Lorna is looking for the wild tea leaves nearby...`,
        },
      ];
    }

    case 'kiko': {
      if (q.m5_takip_kuhol === 'locked') {
        return [
          {
            speaker: npc.name,
            text: `Ouch, scraped my knee diving for a loose ball! Check in with Prof. Dulay at the Plaza first!`,
          },
        ];
      }
      if (q.m5_takip_kuhol === 'available') {
        return [
          {
            speaker: npc.name,
            text: `Hey ${player}! I dove for a loose ball on the court and got a shallow surface scrape on my knee. Nurse Ruth already helped me wash it thoroughly with soap and clean running water.`,
          },
          {
            speaker: npc.name,
            text: `She mentioned a traditional creeping herb growing by the damp stone drain just west of the court — its round scalloped leaves look like tiny snail shells!`,
          },
          {
            speaker: npc.name,
            text: `Can you identify that herb and bring clean leaves so we can prepare a soothing cooling poultice?`,
            onFinish: () => {
              state.setQuestStatus('m5_takip_kuhol', 'active');
              callbacks.toast('📋 Mission 5 Started: Gasgas sa Court (Find Takip-kuhol)');
            },
          },
        ];
      }
      if (q.m5_takip_kuhol === 'active') {
        if (!state.hasCollected('takip_kuhol')) {
          return [
            {
              speaker: npc.name,
              text: `Look right along the damp edge just west of the Basketball Court! It’s a low creeping plant with fan- or kidney-shaped scalloped leaves.`,
            },
          ];
        }
        return [
          {
            speaker: npc.name,
            text: `Awesome, Takip-kuhol (Centella asiatica / Gotu Kola)! So that’s where madecassoside in skin-healing creams comes from!`,
          },
          {
            speaker: npc.name,
            text: `Since we already washed the scrape with soap and clean water, this clean leaf infusion will calm the redness right down. Thanks, ${player}!`,
            onFinish: () => {
              state.setQuestStatus('m5_takip_kuhol', 'completed');
              callbacks.toast('💚 Mission 5 Complete! Kiko learned safe wound care with Takip-kuhol.');
            },
          },
        ];
      }
      return [
        {
          speaker: npc.name,
          text: `My knee scrape is healing super cleanly! Washing with soap & water first + Centella asiatica is the real MVP combo.`,
        },
      ];
    }

    case 'nurse_ruth': {
      return [
        {
          speaker: npc.name,
          text: `Welcome to the UP Baguio University Health Service (UHS), ${player}! I’m Nurse Ruth.`,
        },
        {
          speaker: npc.name,
          text: `We love how Project Saleng teaches students about the DOH’s 10 Pitahc-validated herbal medicines — like Lagundi for cough, Sambong as a diuretic, and Tsaang Gubat for abdominal cramps.`,
        },
        {
          speaker: npc.name,
          text: `Always remember our clinic checklist: (1) Positive botanical ID first, (2) Wash herbs and wounds with clean water, and (3) See a physician for severe, persistent, or feverish symptoms!`,
        },
      ];
    }

    case 'curator': {
      if (q.m6_benguet_lily === 'locked') {
        return [
          {
            speaker: npc.name,
            text: `Welcome to the Museo Kordilyera! Complete Prof. Dulay’s orientation at the Oblation Plaza first, then return to assist our highland exhibition.`,
          },
        ];
      }
      if (q.m6_benguet_lily === 'available') {
        return [
          {
            speaker: npc.name,
            text: `Warm greetings, ${player}! I am Dr. Alangdeo, curator here at the UP Baguio Museo Kordilyera.`,
          },
          {
            speaker: npc.name,
            text: `We are preparing an exhibition on threatened Cordillera endemic plants, centerpiece: the Benguet Lily (Lilium philippinense — "Sabong ti Bantay").`,
          },
          {
            speaker: npc.name,
            text: `A wild specimen is blooming in the Woods behind CSS (#3, Middle Terrace · Elevation 2), just down the west steps from our museum. Because wild lilies are threatened by poaching, you must NEVER pick or uproot it — identify it and capture a geotagged PHOTOGRAPH for our archive!`,
            onFinish: () => {
              state.setQuestStatus('m6_benguet_lily', 'active');
              callbacks.toast('📋 Mission 6 Started: Liryo ng Kabundukan (Photograph Benguet Lily)');
            },
          },
        ];
      }
      if (q.m6_benguet_lily === 'active') {
        if (!state.hasCollected('benguet_lily')) {
          return [
            {
              speaker: npc.name,
              text: `Head down the west museum steps into the Woods behind the College of Social Sciences (CSS #3, Elevation 2). Look among the pines for tall white trumpet blossoms!`,
            },
          ];
        }
        return [
          {
            speaker: npc.name,
            text: `Magnificent photography, ${player}! Look at the white trumpet perianth of Lilium philippinense — and the living plant remains untouched on Pine Hill!`,
          },
          {
            speaker: npc.name,
            text: `While you’re up on Pine Hill, don’t miss documenting the giant Tibanglan Tree Fern (Cyathea contaminans) and wild Sapinit raspberries in the eastern gully!`,
            onFinish: () => {
              state.setQuestStatus('m6_benguet_lily', 'completed');
              callbacks.toast('📸 Mission 6 Complete! Benguet Lily archived at Museo Kordilyera.');
            },
          },
        ];
      }
      return [
        {
          speaker: npc.name,
          text: `Your Benguet Lily photograph is now displayed in the Museo Kordilyera lobby. Ethical conservation fieldwork at its finest!`,
        },
      ];
    }

    case 'bea': {
      if (q.s1_sunflower === 'available') {
        return [
          {
            speaker: npc.name,
            text: `Hi ${player}! I’m shooting photos for Outcrop, our UP Baguio student paper. Everyone calls Baguio’s bright yellow hillside blooms "native Baguio sunflowers"...`,
          },
          {
            speaker: npc.name,
            text: `Wait — are they REALLY native to the Cordillera, or were they introduced? Can you examine the blooming bush right beside us on the College of Science lawn and check its taxonomy?`,
            onFinish: () => {
              state.setQuestStatus('s1_sunflower', 'active');
              callbacks.toast('🌻 Side Quest Started: Sunflower Season Twist');
            },
          },
        ];
      }
      if (q.s1_sunflower === 'active') {
        if (!state.isIdentified('mexican_sunflower')) {
          return [
            {
              speaker: npc.name,
              text: `The yellow-orange bush is right here on the west side of the College of Science lawn! Examine it with [E] and identify it.`,
            },
          ];
        }
        return [
          {
            speaker: npc.name,
            text: `Whoa — it’s Tithonia diversifolia, the MEXICAN Sunflower! So it’s actually an introduced species from Mexico and Central America that naturalized in Baguio!`,
          },
          {
            speaker: npc.name,
            text: `And Benguet farmers use its nutrient-rich leaves as organic green manure! That’s going to make such a great science column in Outcrop. Thanks, ${player}!`,
            onFinish: () => {
              state.setQuestStatus('s1_sunflower', 'completed');
              callbacks.toast('🌻 Side Quest Complete! Bea learned the Tithonia twist.');
            },
          },
        ];
      }
      return [
        {
          speaker: npc.name,
          text: `My article on native vs. introduced Baguio blooms is a hit! Everyone loves learning why conservationists prioritize true Cordillera endemics like the Benguet Lily.`,
        },
      ];
    }

    default:
      return [{ speaker: npc.name, text: 'Hello there!' }];
  }
}
