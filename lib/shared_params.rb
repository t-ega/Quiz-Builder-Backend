module SharedParams
  extend Grape::API::Helpers

  params :question do
    optional :id,
             type: Integer,
             desc: "The  id of the question you are trying to update"
    requires :text, type: String, desc: "The contents of the question"

    requires :question_type,
             type: Symbol,
             values: %i[MULTI_CHOICE SELECT SINGLE],
             desc: "The type of the quiz e.g MULTI-CHOICE, SELECT, SINGLE"

    requires :options_attributes, type: Array do
      optional :id,
               type: Integer,
               desc: "The  id of the option you are trying to update"
      requires :text, type: String, desc: "The contents of the option"
      requires :is_right,
               type: Boolean,
               desc: "Value indicating if the question is right or wrong"
    end
  end
end
