// Every subpage uses the same structure. Add, remove, or reorder sections here.
// Supported section types: text, highlight, cards.
window.PAGE_CONTENT = {
  journal: {
    eyebrow: 'A collection of thoughts',
    title: 'Notes from the margins.',
    introduction: 'A little introduction to this page. Tell visitors what they can find here, in your own voice.',
    sections: [
      { type: 'text', eyebrow: '01 / First chapter', title: 'Where it begins', paragraphs: ['This is a regular text section. Replace this with your own writing.', 'You can add as many paragraphs as you like.'] },
      { type: 'highlight', eyebrow: '02 / A little aside', title: 'Something worth keeping', paragraphs: ['A highlighted section gives a thought or announcement a little extra attention.'] },
      { type: 'cards', eyebrow: '03 / Collected things', title: 'Little discoveries', items: [{title:'First note',text:'A short description.'},{title:'Second note',text:'Another short description.'},{title:'Third note',text:'A third little idea.'}] }
    ]
  },
  projects: {
    eyebrow: 'Ideas in progress', title: 'Things I make.',
    introduction: 'Introduce your projects, experiments, and ongoing ideas here.',
    sections: [
      { type: 'cards', eyebrow: '01 / Selected work', title: 'A few favorites', items: [{title:'Project one',text:'What this project is about.'},{title:'Project two',text:'What makes this one special.'}] },
      { type: 'text', eyebrow: '02 / Behind the scenes', title: 'The process', paragraphs: ['Add some context about how your ideas come together.'] }
    ]
  },
  about: {
    eyebrow: 'A small introduction', title: 'Hello, lovely to meet you.',
    introduction: 'Use this introduction to set the tone and share a little about yourself or your space.',
    sections: [
      { type: 'text', eyebrow: '01 / The story', title: 'A little background', paragraphs: ['Your story goes here.'] }
    ]
  }
};
