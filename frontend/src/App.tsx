// ============================================
// APP - Root-komponent
// ============================================

// SYFTE:
// Detta är huvudkomponenten för hela applikationen.
// Här hanteras hämtning av data och state för incidenter.

// UPPGIFT - STEG 1: Skapa state för incidenter
// Använd useState för att lagra:
// - incidents: array med alla incidenter
// - loading: boolean som visar om data laddas
// - error: eventuella felmeddelanden

// UPPGIFT - STEG 2: Hämta incidenter från backend
// Använd useEffect för att hämta data när komponenten laddas:
// - Fetch från: http://localhost:3001/api/incidents
// - Uppdatera incidents-state med resultatet
// - Sätt loading till false när data är hämtad
// - Hantera fel om backend inte svarar

// UPPGIFT - STEG 3: Rendera komponenter
// - Visa en header med titel
// - Visa NotificationBanner för kritiska incidenter (priority: "critical")
// - Visa IncidentList med alla incidenter
// - Visa laddningsmeddelande om loading är true
// - Visa felmeddelande om error finns

// Tips: Filtrera kritiska incidenter med array.filter()
// Tips: Skicka data till komponenter via props
