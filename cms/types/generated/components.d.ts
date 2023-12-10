import type { Schema, Attribute } from '@strapi/strapi';

export interface QuizQuizGameAnswers extends Schema.Component {
  collectionName: 'components_quiz_game_quiz_game_answers';
  info: {
    displayName: 'Quiz Answers';
    description: '';
  };
  attributes: {
    value: Attribute.String;
  };
}

export interface QuizQuizPacks extends Schema.Component {
  collectionName: 'components_quiz_quiz_packs';
  info: {
    displayName: 'Quiz Packs';
  };
  attributes: {
    name: Attribute.String;
    questions: Attribute.Component<'quiz.quiz-questions', true>;
  };
}

export interface QuizQuizQuestions extends Schema.Component {
  collectionName: 'components_quiz_quiz_questions';
  info: {
    displayName: 'Quiz Questions';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    answers: Attribute.Component<'quiz.quiz-game-answers', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'quiz.quiz-game-answers': QuizQuizGameAnswers;
      'quiz.quiz-packs': QuizQuizPacks;
      'quiz.quiz-questions': QuizQuizQuestions;
    }
  }
}
