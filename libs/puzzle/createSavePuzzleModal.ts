import { getTheme } from 'libs/theme/theme';
import { savePuzzle } from './savePuzzle';

export const createSavePuzzleModal = () => {
  // 모달 배경
  const puzzleDiv = window.document.querySelector('#modal-root');

  // 모달
  const modalDiv = window.document.createElement('div');
  modalDiv.classList.add('complete-modal');

  // 모달 내용물
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalText = document.createElement('p');
  modalText.classList.add('modal-text');
  modalText.textContent = '완성된 퍼즐을 다운로드 하겠습니까?';
  modalContent.appendChild(modalText);

  const btnWrapper = document.createElement('div');
  btnWrapper.classList.add('button-wrapper');
  const saveBtn = document.createElement('button');
  const cancelBtn = document.createElement('button');

  saveBtn.classList.add('modal-btn');
  saveBtn.classList.add('save');

  cancelBtn.classList.add('modal-btn');
  cancelBtn.classList.add('cancel');

  saveBtn.setAttribute('type', 'button');
  cancelBtn.setAttribute('type', 'button');
  saveBtn.textContent = '다운로드';
  saveBtn.style.backgroundColor = getTheme().backgroundColor;
  saveBtn.style.color = getTheme().color;
  cancelBtn.textContent = '닫기';

  saveBtn.addEventListener('mouseover', () => {
    saveBtn.style.backgroundColor = getTheme().hover;
  });

  saveBtn.addEventListener('mouseout', () => {
    saveBtn.style.backgroundColor = getTheme().backgroundColor;
  });

  saveBtn.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    savePuzzle();
  });

  cancelBtn.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    if (!puzzleDiv) return;
    puzzleDiv.removeChild(modalDiv);
  });
  btnWrapper.appendChild(saveBtn);
  btnWrapper.appendChild(cancelBtn);
  modalContent.appendChild(btnWrapper);
  modalDiv.appendChild(modalContent);
  modalDiv.appendChild(modalContent);
  puzzleDiv?.appendChild(modalDiv);
};
