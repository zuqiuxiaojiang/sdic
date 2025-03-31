// 计算总题数
function calculateTotalQuestions(selectedQuestions) {
    let total = 0;
    for (const questions of Object.values(selectedQuestions)) {
        total += questions.length;
    }
    return total;
}

// 渲染总题数
function renderTotalQuestions(total) {
    const totalQuestionsDiv = document.getElementById('total-questions');
    totalQuestionsDiv.textContent = `本次考试总题数：${total} 题`;
    totalQuestionsDiv.style.display = 'block';
}

// 从数组中随机选取指定数量的元素
function getRandomItems(arr, count) {
    const shuffled = arr.slice();
    let i = arr.length;
    let temp;
    let index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, count);
}

// 生成指定数量的题目
function generateSelectedQuestions(counts) {
    const selectedQuestions = {};
    for (const [题型, 题目列表] of Object.entries(questionBank)) {
        const count = counts[题型];
        if (count > 0) {
            selectedQuestions[题型] = getRandomItems(题目列表, Math.min(count, 题目列表.length));
        }
    }
    return selectedQuestions;
}

// 渲染题目
function renderQuestions(selectedQuestions, page = 'all') {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';
    questionContainer.style.display = 'block';

    const submitPaperButton = document.getElementById('submit-paper'); // 获取全局提交按钮

    if (page === 'all') {
        // 全部页面
        for (const [题型, 题目列表] of Object.entries(selectedQuestions)) {
            const 题目数量 = 题目列表.length;
            const 题型标题 = document.createElement('h2');
            题型标题.textContent = `${题型}（共 ${题目数量} 题）`;
            questionContainer.appendChild(题型标题);

            题目列表.forEach((题目, 索引) => {
                renderSingleQuestion(questionContainer, 题目, 题型, 索引);
            });
        }
        // 显示全局提交按钮
        submitPaperButton.style.display = 'block';
    } else {
        // 单个题型页面
        const 题目列表 = selectedQuestions[page];
        if (题目列表) {
            const 题目数量 = 题目列表.length;
            const 题型标题 = document.createElement('h2');
            题型标题.textContent = `${page}（共 ${题目数量} 题）`;
            questionContainer.appendChild(题型标题);

            题目列表.forEach((题目, 索引) => {
                renderSingleQuestion(questionContainer, 题目, page, 索引);
            });

            // 添加单独的提交按钮
            const submitTypeButton = document.createElement('button');
            submitTypeButton.textContent = '提交本题型';
            submitTypeButton.style.display = 'block';
            submitTypeButton.addEventListener('click', () => {
                submitType(selectedQuestions[page], page); // 提交当前题型
            });
            questionContainer.appendChild(submitTypeButton);
        }
        // 隐藏全局提交按钮
        submitPaperButton.style.display = 'none';
    }
}

// 渲染单道题目
function renderSingleQuestion(questionContainer, 题目, 题型, 索引) {
    const 题目容器 = document.createElement('div');
    题目容器.classList.add('question');
    题目容器.setAttribute('data-type', 题型); // 添加题型属性

    const 题目标题 = document.createElement('h3');
    题目标题.textContent = `${索引 + 1}. ${题目.题目}`;
    题目容器.appendChild(题目标题);

    if (题目.媒体) {
        const 媒体容器 = document.createElement('div');
        媒体容器.classList.add('media');

        if (题目.媒体.图片) {
            const 图片 = document.createElement('img');
            图片.src = 题目.媒体.图片;
            媒体容器.appendChild(图片);
        }

        if (题目.媒体.音频) {
            const 音频 = document.createElement('audio');
            音频.src = 题目.媒体.音频;
            音频.controls = true;
            媒体容器.appendChild(音频);
        }

        if (题目.媒体.视频) {
            const 视频 = document.createElement('video');
            视频.src = 题目.媒体.视频;
            视频.controls = true;
            媒体容器.appendChild(视频);
        }

        题目容器.appendChild(媒体容器);
    }

    if (题型 === '单选题' || 题型 === '多选题') {
        题目.选项.forEach((选项, 选项索引) => {
            const 选项容器 = document.createElement('div');
            选项容器.classList.add('option');
            const 输入框 = document.createElement('input');
            输入框.type = 题型 === '单选题' ? 'radio' : 'checkbox';
            输入框.name = `question-${题型}-${索引}`;
            输入框.value = 选项;
            选项容器.appendChild(输入框);
            const 标签 = document.createElement('label');
            标签.textContent = 选项;
            选项容器.appendChild(标签);
            题目容器.appendChild(选项容器);
        });
    } else if (题型 === '判断题') {
        const 正确选项 = document.createElement('div');
        正确选项.classList.add('option');
        const 正确输入框 = document.createElement('input');
        正确输入框.type = 'radio';
        正确输入框.name = `question-判断题-${索引}`;
        正确输入框.value = '正确';
        正确选项.appendChild(正确输入框);
        const 正确标签 = document.createElement('label');
        正确标签.textContent = '正确';
        正确选项.appendChild(正确标签);
        题目容器.appendChild(正确选项);

        const 错误选项 = document.createElement('div');
        错误选项.classList.add('option');
        const 错误输入框 = document.createElement('input');
        错误输入框.type = 'radio';
        错误输入框.name = `question-判断题-${索引}`;
        错误输入框.value = '错误';
        错误选项.appendChild(错误输入框);
        const 错误标签 = document.createElement('label');
        错误标签.textContent = '错误';
        错误选项.appendChild(错误标签);
        题目容器.appendChild(错误选项);
    } else if (题型 === '填空题') {
        const 输入框 = document.createElement('input');
        输入框.type = 'text';
        输入框.placeholder = '请填写答案';
        题目容器.appendChild(输入框);
    } else if (题型 === '简答题') {
        const 文本框 = document.createElement('textarea');
        文本框.rows = 1;
        文本框.placeholder = '请简要回答';
        题目容器.appendChild(文本框);
    }

    const 结果容器 = document.createElement('div');
    结果容器.classList.add('result');
    题目容器.appendChild(结果容器);

    const 正确答案容器 = document.createElement('div');
    正确答案容器.classList.add('correct-answer');
    题目容器.appendChild(正确答案容器);

    const 检查答案按钮 = document.createElement('button');
    检查答案按钮.textContent = '检查答案';
    检查答案按钮.classList.add('check-answer-btn');
    检查答案按钮.addEventListener('click', () => {
        checkSingleAnswer(题目容器, 题目, 题型);
        disableQuestionInputs(题目容器);
    });
    题目容器.appendChild(检查答案按钮);

    questionContainer.appendChild(题目容器);
}

// 处理答案（将数字答案转换为文字答案）
function processAnswer(题目, 答案) {
    if (typeof 答案 === 'number' && 题目.选项) {
        return 题目.选项[答案];
    }
    if (Array.isArray(答案)) {
        return 答案.map((item) => typeof item === 'number' && 题目.选项 ? 题目.选项[item] : item);
    }
    return 答案;
}

// 检查单道题答案
function checkSingleAnswer(题目容器, 题目, 题型) {
    const 结果容器 = 题目容器.querySelector('.result');
    const 正确答案容器 = 题目容器.querySelector('.correct-answer');
    结果容器.textContent = '';
    正确答案容器.textContent = '';

    let 用户答案;
    if (题型 === '单选题' || 题型 === '判断题') {
        const 选中选项 = 题目容器.querySelector('input[type="radio"]:checked');
        用户答案 = 选中选项 ? 选中选项.value : null;
    } else if (题型 === '多选题') {
        const 选中选项列表 = Array.from(题目容器.querySelectorAll('input[type="checkbox"]:checked'));
        用户答案 = 选中选项列表.map(选项 => 选项.value);
    } else if (题型 === '填空题') {
        const 输入框 = 题目容器.querySelector('input[type="text"]');
        用户答案 = 输入框.value;
    } else if (题型 === '简答题') {
        const 文本框 = 题目容器.querySelector('textarea');
        用户答案 = 文本框.value;
    }

    let 正确答案 = processAnswer(题目, 题目.答案);

    let 回答正确;
    if (题型 === '多选题') {
        回答正确 = 用户答案.length === 正确答案.length && 用户答案.every(val => 正确答案.includes(val));
    } else {
        回答正确 = 用户答案 === 正确答案;
    }

    结果容器.textContent = 回答正确 ? '回答正确' : '回答错误';
    结果容器.classList.add(回答正确 ? 'correct' : 'incorrect');

    if (!回答正确) {
        let 正确答案文本;
        if (题型 === '多选题') {
            正确答案文本 = 正确答案.join(', ');
        } else {
            正确答案文本 = 正确答案;
        }
        正确答案容器.textContent = `正确答案：${正确答案文本}`;
    }
}

// 禁用单道题的输入元素
function disableQuestionInputs(题目容器) {
    const 输入元素 = 题目容器.querySelectorAll('input, textarea');
    输入元素.forEach(元素 => {
        元素.disabled = true;
    });
}

// 提交单个题型的答卷
function submitType(题目列表, 题型) {
    let 答对数量 = 0;
    let 答错数量 = 0;

    const 题目容器列表 = document.querySelectorAll(`.question[data-type="${题型}"]`);
    题目列表.forEach((题目, 索引) => {
        const 题目容器 = 题目容器列表[索引];
        const 结果容器 = 题目容器.querySelector('.result');
        const 正确答案容器 = 题目容器.querySelector('.correct-answer');
        结果容器.textContent = '';
        正确答案容器.textContent = '';

        let 用户答案;
        if (题型 === '单选题' || 题型 === '判断题') {
            const 选中选项 = 题目容器.querySelector('input[type="radio"]:checked');
            用户答案 = 选中选项 ? 选中选项.value : null;
        } else if (题型 === '多选题') {
            const 选中选项列表 = Array.from(题目容器.querySelectorAll('input[type="checkbox"]:checked'));
            用户答案 = 选中选项列表.map(选项 => 选项.value);
        } else if (题型 === '填空题') {
            const 输入框 = 题目容器.querySelector('input[type="text"]');
            用户答案 = 输入框.value;
        } else if (题型 === '简答题') {
            const 文本框 = 题目容器.querySelector('textarea');
            用户答案 = 文本框.value;
        }

        let 正确答案 = processAnswer(题目, 题目.答案);

        let 回答正确;
        if (题型 === '多选题') {
            回答正确 = 用户答案.length === 正确答案.length && 用户答案.every(val => 正确答案.includes(val));
        } else {
            回答正确 = 用户答案 === 正确答案;
        }

        结果容器.textContent = 回答正确 ? '回答正确' : '回答错误';
        结果容器.classList.add(回答正确 ? 'correct' : 'incorrect');

        if (!回答正确) {
            let 正确答案文本;
            if (题型 === '多选题') {
                正确答案文本 = 正确答案.join(', ');
            } else {
                正确答案文本 = 正确答案;
            }
            正确答案容器.textContent = `正确答案：${正确答案文本}`;
            答错数量++;
        } else {
            答对数量++;
        }

        disableQuestionInputs(题目容器);
    });

    const 结果总结容器 = document.getElementById('result-summary');
    结果总结容器.textContent = `在 ${题型} 中，答对 ${答对数量} 题，答错 ${答错数量} 题`;
    结果总结容器.style.display = 'block';
}

// 提交全部题型的答卷
function submitPaper(selectedQuestions) {
    let 答对数量 = 0;
    let 答错数量 = 0;

    for (const [题型, 题目列表] of Object.entries(selectedQuestions)) {
        const 题目容器列表 = document.querySelectorAll(`.question[data-type="${题型}"]`);
        题目列表.forEach((题目, 索引) => {
            const 题目容器 = 题目容器列表[索引];
            const 结果容器 = 题目容器.querySelector('.result');
            const 正确答案容器 = 题目容器.querySelector('.correct-answer');
            结果容器.textContent = '';
            正确答案容器.textContent = '';

            let 用户答案;
            if (题型 === '单选题' || 题型 === '判断题') {
                const 选中选项 = 题目容器.querySelector('input[type="radio"]:checked');
                用户答案 = 选中选项 ? 选中选项.value : null;
            } else if (题型 === '多选题') {
                const 选中选项列表 = Array.from(题目容器.querySelectorAll('input[type="checkbox"]:checked'));
                用户答案 = 选中选项列表.map(选项 => 选项.value);
            } else if (题型 === '填空题') {
                const 输入框 = 题目容器.querySelector('input[type="text"]');
                用户答案 = 输入框.value;
            } else if (题型 === '简答题') {
                const 文本框 = 题目容器.querySelector('textarea');
                用户答案 = 文本框.value;
            }

            let 正确答案 = processAnswer(题目, 题目.答案);

            let 回答正确;
            if (题型 === '多选题') {
                回答正确 = 用户答案.length === 正确答案.length && 用户答案.every(val => 正确答案.includes(val));
            } else {
                回答正确 = 用户答案 === 正确答案;
            }

            结果容器.textContent = 回答正确 ? '回答正确' : '回答错误';
            结果容器.classList.add(回答正确 ? 'correct' : 'incorrect');

            if (!回答正确) {
                let 正确答案文本;
                if (题型 === '多选题') {
                    正确答案文本 = 正确答案.join(', ');
                } else {
                    正确答案文本 = 正确答案;
                }
                正确答案容器.textContent = `正确答案：${正确答案文本}`;
                答错数量++;
            } else {
                答对数量++;
            }

            disableQuestionInputs(题目容器);
        });
    }

    const 结果总结容器 = document.getElementById('result-summary');
    结果总结容器.textContent = `答对 ${答对数量} 题，答错 ${答错数量} 题`;
    结果总结容器.style.display = 'block';
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
    const modeSelection = document.getElementById('mode-selection');
    const examSetup = document.getElementById('exam-setup');
    const practiceModeBtn = document.getElementById('practice-mode');
    const examModeBtn = document.getElementById('exam-mode');
    const totalQuestions = document.getElementById('total-questions');
    const pagination = document.getElementById('pagination');
    const questionContainer = document.getElementById('question-container');
    const submitPaperButton = document.getElementById('submit-paper');
    const resultSummary = document.getElementById('result-summary');

    practiceModeBtn.addEventListener('click', () => {
        modeSelection.style.display = 'none';
        examSetup.style.display = 'none';
        totalQuestions.style.display = 'block';
        pagination.style.display = 'block';
        questionContainer.style.display = 'block';

        const selectedQuestions = questionBank;
        const total = calculateTotalQuestions(selectedQuestions);
        renderTotalQuestions(total);
        renderQuestions(selectedQuestions);

        const paginationButtons = document.querySelectorAll('#pagination button');
        paginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const page = button.dataset.page;
                renderQuestions(selectedQuestions, page);
            });
        });

        submitPaperButton.addEventListener('click', () => {
            submitPaper(selectedQuestions);
        });
    });

    examModeBtn.addEventListener('click', () => {
        modeSelection.style.display = 'none';
        examSetup.style.display = 'block';

        const startExamButton = document.getElementById('start-exam');
        startExamButton.addEventListener('click', () => {
            const singleChoiceCount = parseInt(document.getElementById('single-choice-count').value) || 0;
            const multipleChoiceCount = parseInt(document.getElementById('multiple-choice-count').value) || 0;
            const trueFalseCount = parseInt(document.getElementById('true-false-count').value) || 0;
            const fillInTheBlankCount = parseInt(document.getElementById('fill-in-the-blank-count').value) || 0;
            const shortAnswerCount = parseInt(document.getElementById('short-answer-count').value) || 0;

            const counts = {
                单选题: singleChoiceCount,
                多选题: multipleChoiceCount,
                判断题: trueFalseCount,
                填空题: fillInTheBlankCount,
                简答题: shortAnswerCount
            };

            const selectedQuestions = generateSelectedQuestions(counts);
            const total = calculateTotalQuestions(selectedQuestions);
            renderTotalQuestions(total);
            renderQuestions(selectedQuestions);

            totalQuestions.style.display = 'block';
            pagination.style.display = 'block';
            questionContainer.style.display = 'block';

            const paginationButtons = document.querySelectorAll('#pagination button');
            paginationButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const page = button.dataset.page;
                    renderQuestions(selectedQuestions, page);
                });
            });

            submitPaperButton.addEventListener('click', () => {
                submitPaper(selectedQuestions);
            });
        });
    });
});