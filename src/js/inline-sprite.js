import sprite from 'bundle-text:../img/icons.svg';

const wrapper = document.createElement('div');
wrapper.style.display = 'none';
wrapper.innerHTML = sprite;

// بگذار در ابتدای body تا همه جا قابل دسترسی باشد
document.body.prepend(wrapper);
