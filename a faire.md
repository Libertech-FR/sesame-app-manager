cycle de vie enum dynamique, 
en dur ACTIVE devient OFFICIAL, INACTIF, MANUEL
les autres sont par defaut

ficher default cycle de vie:
En Attente        = supannRessourceEtat : {COMPTE} A SupannAnticipe
OFFI                = supannRessourceEtat : {COMPTE} A SupannActif
PROV              = supannResourceEtat : {COMTE} A SupannSursis et supannRessourceEtatDate: Date de passage en PROV
INACTIF          = supannRessourceEtat : {COMPTE} I SupannInactif
A Détruire        = supannRessourceEtat : {COMPTE} I SupannSupprCompte
Vérouillé          = supannRessourceEtat : {COMPTE} S SupannVerrouille

trigger devient un nombre positif / dernier etat superieur a x jours
ajouter une clé mutation


voir le diff des modifs
