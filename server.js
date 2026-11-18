const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let registrations = [
  {
    id: 501,
    participantName: "Riya Sharma",
    eventName: "Tech Fest",
    department: "CSE",
    ticketCount: 2,
    paymentStatus: "Paid"
  },
  {
    id: 502,
    participantName: "Arjun Mehta",
    eventName: "Code Sprint",
    department: "IT",
    ticketCount: 1,
    paymentStatus: "Pending"
  },
  {
    id: 503,
    participantName: "Neha Verma",
    eventName: "Tech Fest",
    department: "ECE",
    ticketCount: 3,
    paymentStatus: "Paid"
  }
];

const validateRecord = (body) => {
  const { participantName, eventName, department, ticketCount, paymentStatus } = body;
  
  if (
    !participantName || typeof participantName !== 'string' ||
    !eventName || typeof eventName !== 'string' ||
    !department || typeof department !== 'string' ||
    ticketCount === undefined || typeof ticketCount !== 'number' || ticketCount <= 0 ||
    !paymentStatus || (paymentStatus !== 'Paid' && paymentStatus !== 'Pending')
  ) {
    return false;
  }
  return true;
};

app.get('/api/registrations/pending', (req, res) => {
  const pendingRegistrations = registrations.filter(
    reg => reg.paymentStatus.toLowerCase() === 'pending'
  );
  res.status(200).json(pendingRegistrations);
});

app.get('/api/registrations/filter', (req, res) => {
  const deptQuery = req.query.department;
  
  if (!deptQuery) {
    return res.status(200).json(registrations);
  }

  const filtered = registrations.filter(
    reg => reg.department.toLowerCase() === deptQuery.toLowerCase()
  );
  
  res.status(200).json(filtered);
});


app.get('/api/registrations', (req, res) => {
  res.status(200).json(registrations);
});


app.get('/api/registrations/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const record = registrations.find(reg => reg.id === id);

  if (!record) {
    return res.status(404).json({ error: "Registration not found" });
  }

  res.status(200).json(record);
});

app.post('/api/registrations', (req, res) => {
  if (!validateRecord(req.body)) {
    return res.status(400).json({ error: "Invalid input or validation failed." });
  }

  const { participantName, eventName, department, ticketCount, paymentStatus } = req.body;

  const newId = registrations.length > 0 ? Math.max(...registrations.map(r => r.id)) + 1 : 501;

  const newRecord = {
    id: newId,
    participantName,
    eventName,
    department,
    ticketCount,
    paymentStatus
  };

  registrations.push(newRecord);
  res.status(201).json(newRecord);
});

app.put('/api/registrations/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = registrations.findIndex(reg => reg.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Registration not found" });
  }

  if (!validateRecord(req.body)) {
    return res.status(400).json({ error: "Invalid input or validation failed." });
  }

  const { participantName, eventName, department, ticketCount, paymentStatus } = req.body;

  registrations[index] = {
    id,
    participantName,
    eventName,
    department,
    ticketCount,
    paymentStatus
  };

  res.status(200).json(registrations[index]);
});

app.delete('/api/registrations/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = registrations.findIndex(reg => reg.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Registration not found" });
  }

  registrations.splice(index, 1);
  res.status(200).json({ message: "Registration deleted successfully" });
});

app.get('/', (req, res) => {
    res.send('Event Registration API is running');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});