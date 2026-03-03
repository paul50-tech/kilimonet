const intakeForm = document.getElementById('project-intake-form');
const intakeConfirmation = document.getElementById('intake-confirmation');

if (intakeForm && intakeConfirmation) {
  intakeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    intakeConfirmation.hidden = false;
    intakeForm.reset();
    intakeConfirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
